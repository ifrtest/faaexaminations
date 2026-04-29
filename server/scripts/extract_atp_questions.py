#!/usr/bin/env python3
"""
ATP Question Extractor — Gleim Airline Transport Pilot PDF
Outputs structured JSON for review before database insertion.
Does NOT touch the database.
"""

import fitz
import re
import json
from pathlib import Path
from collections import Counter

PDF_PATH = Path("/Users/leila/Downloads/Gleim.pdf")
OUTPUT_PATH = Path(__file__).parent / "atp_questions_extracted.json"

QUESTION_START_PAGE = 40   # 0-indexed
QUESTION_END_PAGE = 968    # exclude appendices/practice tests
COLUMN_SPLIT_X = 200

RE_ANSWER = re.compile(r'Answer \(([A-D])\) is correct\.(?:\s*\(([^)]+)\))?(.*)', re.DOTALL | re.IGNORECASE)
RE_SU = re.compile(r'SU\s*(\d+)\s*:\s*([^\n]+)', re.IGNORECASE)
RE_FIGURE = re.compile(r'(?:Refer to|See)\s+(?:Figure|Fig\.?)\s*(\d+)', re.IGNORECASE)
RE_QNUM = re.compile(r'^(\d{1,3})\.\s+(.+)', re.DOTALL)
RE_CHOICE_BARE = re.compile(r'^([A-D])\.\s*$')
RE_CHOICE_WITH_TEXT = re.compile(r'^([A-D])\.\s+(.+)')


def clean(text):
    return re.sub(r'\s+', ' ', (text or '')).strip()


def parse_block_segments(block_text):
    """
    Break a block into typed segments: ('QNUM', num, text), ('CHOICE', letter, text), ('TEXT', None, text)
    Handles:
      - 'A.\n' on its own line (choice letter without text, text follows on next line)
      - 'A. Text\nB. Text' multiple choices in one block
    """
    segments = []
    lines = block_text.split('\n')
    pending_choice = None

    for raw in lines:
        line = raw.strip()
        if not line:
            continue

        # Pending choice from previous line (bare "A.\n" case)
        if pending_choice:
            segments.append(('CHOICE', pending_choice, clean(line)))
            pending_choice = None
            continue

        # Bare choice letter: "A." with nothing after it
        m = RE_CHOICE_BARE.match(line)
        if m:
            pending_choice = m.group(1)
            continue

        # Choice with text: "A. Some text"
        m = RE_CHOICE_WITH_TEXT.match(line)
        if m:
            segments.append(('CHOICE', m.group(1), clean(m.group(2))))
            continue

        # Question number: "N. Some text" — require N <= 500 and followed by space
        m = RE_QNUM.match(line)
        if m:
            num = int(m.group(1))
            if num <= 500:
                segments.append(('QNUM', num, clean(m.group(2))))
                continue

        # Skip section header lines like "830.15 Definitions" or "1.1 NTSB Part 830"
        if re.match(r'^\d+\.\d+\s+\S', line):
            segments.append(('SECTION', None, clean(line)))
            continue

        # Everything else
        segments.append(('TEXT', None, clean(line)))

    return segments


def parse_questions(left_blocks, min_question_y):
    """
    Parse questions from (y0, text) left-column blocks.
    Only process blocks where y0 >= min_question_y (filters out outline items above questions).
    Returns list of question dicts with y_start.
    """
    questions = []
    current = None

    for y0, block_text in left_blocks:
        segs = parse_block_segments(block_text)

        for seg in segs:
            kind, seg_id, seg_text = seg

            if kind == 'SECTION':
                continue  # section headers, not question content

            if kind == 'QNUM':
                # Only accept as a question if y0 is in the question zone
                if y0 >= min_question_y:
                    if current:
                        questions.append(current)
                    current = {
                        'local_num': seg_id,
                        'text': seg_text,
                        'choice_a': '',
                        'choice_b': '',
                        'choice_c': '',
                        'choice_d': '',
                        'y_start': y0,
                    }
                # else: it's an outline item; skip

            elif kind == 'CHOICE':
                if current is None:
                    continue
                letter = seg_id
                field = f'choice_{letter.lower()}'
                if not current[field]:
                    current[field] = seg_text
                else:
                    current[field] += ' ' + seg_text

            elif kind == 'TEXT':
                if current is None:
                    continue
                # Append to last non-empty field
                t = seg_text
                if current['choice_d']:
                    current['choice_d'] += ' ' + t
                elif current['choice_c']:
                    current['choice_c'] += ' ' + t
                elif current['choice_b']:
                    current['choice_b'] += ' ' + t
                elif current['choice_a']:
                    current['choice_a'] += ' ' + t
                else:
                    current['text'] += ' ' + t

    if current:
        questions.append(current)

    return questions


def parse_answers(right_blocks):
    """
    Parse answer explanations from (y0, text) right-column blocks.
    Returns list of {correct_answer, citation, explanation, y_start}.
    """
    answers = []
    current = None

    for y0, block_text in right_blocks:
        text = clean(block_text)

        m = RE_ANSWER.match(text)
        if m:
            if current:
                answers.append(current)
            remainder = clean(m.group(3) or '')
            if remainder.lower().startswith('discussion:'):
                discussion = remainder[len('discussion:'):].strip()
            else:
                discussion = remainder
            current = {
                'correct_answer': m.group(1),
                'citation': clean(m.group(2) or ''),
                'explanation': discussion,
                'y_start': y0,
            }
            continue

        if current is not None:
            current['explanation'] = (current['explanation'] + ' ' + text).strip()

    if current:
        answers.append(current)

    return answers


def match_questions_answers(questions, answers):
    """
    Match each question to the nearest answer by y_start.
    Returns list of (q, ans_or_None, y_dist).
    """
    used = set()
    result = []

    for q in questions:
        best_idx = None
        best_dist = float('inf')
        for i, a in enumerate(answers):
            if i in used:
                continue
            dist = abs(a['y_start'] - q['y_start'])
            if dist < best_dist:
                best_dist = dist
                best_idx = i

        if best_idx is not None and best_dist < 300:
            used.add(best_idx)
            result.append((q, answers[best_idx], best_dist))
        else:
            result.append((q, None, -1))

    return result


def get_page_blocks(page):
    """Split page blocks into (left, right) lists of (y0, text)."""
    left, right = [], []
    for b in page.get_text('blocks'):
        x0, y0, x1, y1, text, bn, bt = b
        if bt != 0 or not text.strip():
            continue
        if x0 < COLUMN_SPLIT_X:
            left.append((y0, text.strip()))
        else:
            right.append((y0, text.strip()))
    left.sort(key=lambda x: x[0])
    right.sort(key=lambda x: x[0])
    return left, right


def first_answer_y(right_blocks):
    """Return y-position of the first 'Answer (' block, or 0 if none."""
    for y0, text in right_blocks:
        if RE_ANSWER.match(clean(text)):
            return y0
    return 0


def main():
    print(f"Opening: {PDF_PATH}")
    doc = fitz.open(str(PDF_PATH))
    print(f"Total pages: {len(doc)}")
    print(f"Processing pages {QUESTION_START_PAGE+1}–{QUESTION_END_PAGE}...")

    all_questions = []
    flags = []
    global_num = 0
    current_su_num = 0
    current_su_name = ''
    current_subsection = ''

    for page_idx in range(QUESTION_START_PAGE, QUESTION_END_PAGE):
        page = doc[page_idx]
        full_text = page.get_text()

        if 'Answer (' not in full_text:
            continue

        # Track study unit (1-18 only)
        su_m = RE_SU.search(full_text)
        if su_m:
            new_num = int(su_m.group(1))
            if 1 <= new_num <= 18 and new_num != current_su_num:
                current_su_num = new_num
                current_su_name = clean(su_m.group(2))

        # Track subsection
        sub_m = re.search(r'\n(\d+\.\d+)\s+([^\n]+)', full_text)
        if sub_m:
            current_subsection = f"{sub_m.group(1)} {clean(sub_m.group(2))}"

        left_blocks, right_blocks = get_page_blocks(page)

        # Find where questions start on this page
        # (right column's first Answer block tells us the minimum y for real questions)
        min_q_y = first_answer_y(right_blocks) - 80  # allow question to start slightly above its answer
        if min_q_y < 0:
            min_q_y = 0

        page_questions = parse_questions(left_blocks, min_q_y)
        page_answers = parse_answers(right_blocks)

        if not page_questions:
            continue

        matched = match_questions_answers(page_questions, page_answers)

        for q, ans, ydist in matched:
            global_num += 1
            all_text = ' '.join([q['text'], q['choice_a'], q['choice_b'], q['choice_c'], q.get('choice_d', '')])
            fig_refs = RE_FIGURE.findall(all_text)

            # Recovery: if answer not matched from right column, look in left-column text
            if ans is None:
                for field in ['choice_a', 'choice_b', 'choice_c', 'choice_d', 'text']:
                    emb = RE_ANSWER.search(q.get(field, '') or '')
                    if emb:
                        ans = {'correct_answer': emb.group(1), 'citation': clean(emb.group(2) or ''), 'explanation': clean(emb.group(3) or '')}
                        # Clean the embedded answer text out of the field
                        q[field] = RE_ANSWER.sub('', q[field]).strip()
                        break

            entry = {
                'global_num': global_num,
                'page': page_idx + 1,
                'study_unit_num': current_su_num,
                'study_unit_name': current_su_name,
                'subsection': current_subsection,
                'local_num': q['local_num'],
                'question_text': clean(q['text']),
                'choice_a': clean(q['choice_a']),
                'choice_b': clean(q['choice_b']),
                'choice_c': clean(q['choice_c']),
                'choice_d': clean(q.get('choice_d', '')) or None,
                'correct_answer': ans['correct_answer'] if ans else '?',
                'explanation': clean(ans['explanation']) if ans else '',
                'citation': ans['citation'] if ans else '',
                'figure_refs': sorted(set(fig_refs)),
                'image_url': None,
            }

            # Recovery: try to extract inline choices from question_text if missing
            if not entry['choice_a'] or not entry['choice_b'] or not entry['choice_c']:
                # Pattern: "A. text B. text C. text" all in question_text
                inline = re.split(r'\s+([A-C])\.\s+', entry['question_text'])
                if len(inline) >= 5:  # [pre, 'A', atext, 'B', btext, 'C', ctext...]
                    entry['question_text'] = inline[0].strip()
                    mapping = {'A': 'choice_a', 'B': 'choice_b', 'C': 'choice_c'}
                    for j in range(1, len(inline)-1, 2):
                        letter = inline[j]
                        text_val = inline[j+1].strip()
                        if letter in mapping:
                            entry[mapping[letter]] = clean(text_val)

            issues = []
            if not entry['choice_a'] or not entry['choice_b'] or not entry['choice_c']:
                issues.append('MISSING_CHOICES')
            if entry['correct_answer'] == '?':
                issues.append('NO_ANSWER')
            if len(entry['question_text']) < 10:
                issues.append('SHORT_QUESTION')
            if 0 < ydist > 150:
                issues.append(f'Y_MISMATCH({ydist:.0f})')

            if issues:
                entry['FLAG'] = ' '.join(issues)
                flags.append({'global_num': global_num, 'page': page_idx+1, 'issue': entry['FLAG'], 'text': entry['question_text'][:100]})

            all_questions.append(entry)

    # Stats
    print(f"\nTotal questions extracted: {len(all_questions)}")
    print(f"Total flags: {len(flags)}")

    su_counts = Counter(q['study_unit_num'] for q in all_questions)
    print("\nQuestions per Study Unit:")
    for su_num in sorted(su_counts.keys()):
        su_name = next((q['study_unit_name'] for q in all_questions if q['study_unit_num'] == su_num), '')
        print(f"  SU {su_num:2d}: {su_counts[su_num]:3d} — {su_name}")

    ans_dist = Counter(q['correct_answer'] for q in all_questions)
    print(f"\nAnswer distribution: {dict(sorted(ans_dist.items()))}")

    flag_types = Counter()
    for f in flags:
        for t in f['issue'].split():
            flag_types[t.split('(')[0]] += 1
    print(f"Flag types: {dict(flag_types)}")

    # Sample output
    print("\n--- Sample: questions 1–5 ---")
    for q in all_questions[:5]:
        flag = q.get('FLAG', 'OK')
        print(f"  #{q['global_num']} SU{q['study_unit_num']} p{q['page']} [{flag}]")
        print(f"    Q: {q['question_text'][:90]}")
        print(f"    A: {q['choice_a'][:70]}")
        print(f"    B: {q['choice_b'][:70]}")
        print(f"    C: {q['choice_c'][:70]}")
        print(f"    Correct: {q['correct_answer']}")
        print()

    output = {
        'meta': {
            'total_questions': len(all_questions),
            'total_flagged': len(flags),
            'source': 'Gleim Airline Transport Pilot FAA Knowledge Test (2017 Edition)',
            'exam_code': 'ATP',
            'note': 'REVIEW BEFORE INSERTING. New ATP package only — do NOT overwrite PAR/IRA/CAX/UAG/TRUST.'
        },
        'flags': flags,
        'questions': all_questions,
    }

    OUTPUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    print(f"Output → {OUTPUT_PATH}")


if __name__ == '__main__':
    main()
