# UAG — Chart & Figure-Dependent Questions
# DO NOT insert into database until images are attached.
# Each question needs the referenced figure uploaded and linked via question image_url.

## HOW TO INSERT
1. Upload the figure image via admin panel (or /uploads/ folder on Render)
2. Note the image URL
3. Insert question with image_url = that URL, is_active = false
4. Review in admin, then activate

---

## SECTIONAL CHART QUESTIONS
### (Need: FAA sectional chart crop showing airspace boundaries, class E, class B, class D, etc.)

**Q-CHART-001**
Topic: Airspace Classification (topic_id = 264)
Exam: UAG (exam_id = 4)
Figure needed: Sectional chart excerpt showing Class B, C, D, and E airspace depicted in legend

Question: Refer to the sectional chart legend. What color depicts Class E airspace that begins at 700 feet AGL on a sectional chart?
A) Solid blue line
B) Magenta vignette (fade)
C) Solid magenta line
D) Blue vignette (fade)
Correct: B
Explanation: Class E airspace beginning at 700 feet AGL is shown by a magenta vignette (fuzzy/faded edge) on sectional charts. A solid magenta line indicates Class E beginning at the surface.

---

**Q-CHART-002**
Topic: Airspace Classification (topic_id = 264)
Exam: UAG (exam_id = 4)
Figure needed: Sectional chart crop showing a Class D surface area with dashed blue circle

Question: Referring to the sectional chart excerpt, the dashed blue circle surrounding an airport indicates which class of airspace?
A) Class B
B) Class C
C) Class D
D) Class E
Correct: C
Explanation: Class D airspace is depicted on sectional charts with a dashed blue circle surrounding the airport. It typically extends from the surface to 2,500 feet AGL.

---

**Q-CHART-003**
Topic: Airspace Classification (topic_id = 264)
Exam: UAG (exam_id = 4)
Figure needed: Sectional chart showing a TFR area or MOA

Question: Refer to the sectional chart. The area depicted with a blue crosshatch pattern most likely indicates which type of special use airspace?
A) Military Operations Area (MOA)
B) Restricted Area
C) Warning Area
D) Alert Area
Correct: B
Explanation: Restricted areas are depicted with blue crosshatching on sectional charts. They are designated areas where flight is restricted due to hazardous activities such as aerial gunnery or missile testing.

---

**Q-CHART-004**
Topic: Airspace Classification (topic_id = 264)
Exam: UAG (exam_id = 4)
Figure needed: Sectional chart with Class B airspace shown as solid blue lines with altitudes

Question: Referring to the sectional chart, the solid blue lines with altitude numbers represent the boundaries of which airspace?
A) Class C
B) Class B
C) Class D
D) Class E
Correct: B
Explanation: Class B airspace is depicted by solid blue lines forming the lateral limits of each segment. The altitude values printed on or near the lines show the floor and ceiling of each segment (e.g., 80/30 means from 3,000 to 8,000 feet MSL).

---

**Q-CHART-005**
Topic: Airspace Classification (topic_id = 264)
Exam: UAG (exam_id = 4)
Figure needed: Sectional chart showing Class C airspace with solid magenta circles

Question: On a sectional chart, solid magenta circles surrounding an airport depict which class of airspace?
A) Class B
B) Class C
C) Class D
D) Class E at the surface
Correct: B
Explanation: Class C airspace is depicted by solid magenta circles on sectional charts. It typically has an inner circle (surface to 1,200 feet AGL) and outer circle (1,200 to 4,000 feet AGL above the airport elevation).

---

## METAR / WEATHER DECODE QUESTIONS
### (Need: printed METAR example to display in question image)

**Q-METAR-001**
Topic: Weather (topic_id = 265)
Exam: UAG (exam_id = 4)
Figure needed: METAR printout, e.g.:
METAR KORD 121755Z 27015G25KT 3/4SM +TSRA BKN030CB OVC060 18/15 A2985 RMK AO2

Question: Refer to the METAR. What weather phenomenon is indicated by "+TSRA"?
A) Light rain with trace thunderstorms
B) Heavy thunderstorm with rain
C) Moderate thunderstorm with light rain
D) Thunderstorm with freezing rain
Correct: B
Explanation: In METAR notation, "+" indicates heavy intensity, "TS" is thunderstorm, and "RA" is rain. Combined, "+TSRA" means heavy thunderstorm with rain — conditions that would be extremely hazardous for sUAS operations.

---

**Q-METAR-002**
Topic: Weather (topic_id = 265)
Exam: UAG (exam_id = 4)
Figure needed: METAR printout, e.g.:
METAR KDEN 151256Z 00000KT 10SM SKC 22/M03 A3018

Question: Refer to the METAR. What are the reported visibility and sky conditions?
A) 10 statute miles, clear skies
B) 10 nautical miles, scattered clouds
C) 10 kilometers, clear skies
D) 1,000 feet visibility, sky obscured
Correct: A
Explanation: "10SM" means 10 statute miles visibility. "SKC" means sky clear (no clouds). These are ideal VMC conditions for sUAS operations.

---

**Q-METAR-003**
Topic: Weather (topic_id = 265)
Exam: UAG (exam_id = 4)
Figure needed: METAR printout, e.g.:
METAR KLAX 181552Z 26008KT 7SM FEW020 SCT050 BKN100 20/12 A2998

Question: Refer to the METAR. The cloud layer reported as "BKN100" indicates:
A) Broken clouds at 100 feet AGL
B) Broken clouds at 10,000 feet MSL
C) Broken clouds at 1,000 feet AGL
D) Broken clouds at 10,000 feet AGL
Correct: B
Explanation: Cloud heights in METARs are reported in hundreds of feet AGL. "BKN100" means broken clouds at 10,000 feet AGL (100 × 100 = 10,000). Broken is 5–7 oktas (5/8 to 7/8 sky coverage).

---

## TAF QUESTIONS
### (Need: printed TAF example to display in question image)

**Q-TAF-001**
Topic: Weather (topic_id = 265)
Exam: UAG (exam_id = 4)
Figure needed: TAF printout, e.g.:
TAF KORD 121130Z 1212/1312 27015KT P6SM SKC
  FM122000 25020G35KT 3SM TSRA OVC040CB
  FM130600 28010KT 6SM BKN030 OVC060

Question: Refer to the TAF. According to the "FM122000" group, what conditions are forecast beginning at 2000Z?
A) Winds 250° at 20 knots, visibility greater than 6 SM, sky clear
B) Winds 250° at 20 knots gusting 35 knots, 3 SM visibility, thunderstorm with rain, overcast at 4,000 feet with cumulonimbus
C) Winds 280° at 10 knots, 6 SM visibility, broken at 3,000 feet, overcast at 6,000 feet
D) Winds calm, sky clear, visibility 6 SM
Correct: B
Explanation: "FM" means "from" — conditions change starting at that time. FM122000 = from the 12th at 2000Z. "25020G35KT" = winds 250° at 20 knots gusting 35 knots. "3SM" = 3 statute miles. "TSRA" = thunderstorm with rain. "OVC040CB" = overcast at 4,000 feet with cumulonimbus. These conditions are dangerous for sUAS flight.

---

## PERFORMANCE CHART QUESTIONS
### (Need: generic drone/aircraft loading chart or density altitude chart)

**Q-PERF-001**
Topic: Loading & Performance (topic_id = 266)
Exam: UAG (exam_id = 4)
Figure needed: Density altitude chart (pressure altitude vs. temperature)

Question: Refer to the density altitude chart. An airport at 5,000 feet pressure altitude with an outside air temperature of 30°C has an approximate density altitude of:
A) 5,000 feet
B) 7,200 feet
C) 3,800 feet
D) 6,100 feet
Correct: B
Explanation: High temperature increases density altitude significantly above pressure altitude. At 5,000 feet pressure altitude and 30°C (well above standard temperature of 5°C at that altitude), density altitude rises to approximately 7,200 feet. Higher density altitude reduces air density, degrading sUAS motor and battery performance.

---

**Q-PERF-002**
Topic: Loading & Performance (topic_id = 266)
Exam: UAG (exam_id = 4)
Figure needed: Weight and balance diagram showing CG limits

Question: Refer to the loading chart. If the computed center of gravity falls aft of the aft CG limit, the sUAS will likely exhibit which flight characteristic?
A) Nose-heavy tendency, increased stability
B) Tail-heavy tendency, reduced pitch stability and possible loss of control
C) Reduced airspeed, increased range
D) No effect on flight characteristics
Correct: B
Explanation: An aft CG condition means the aircraft's weight is biased toward the tail. This reduces pitch stability and can make the aircraft difficult to control. The remote pilot must ensure the sUAS is loaded within CG limits specified by the manufacturer.

---

## AIRPORT DIAGRAM QUESTIONS
### (Need: sample FAA airport diagram)

**Q-APRT-001**
Topic: Airspace Classification (topic_id = 264)
Exam: UAG (exam_id = 4)
Figure needed: FAA airport diagram showing runway numbering and taxiways

Question: Refer to the airport diagram. Runway 28L is oriented in which magnetic direction?
A) 280°
B) 100°
C) 260°
D) 080°
Correct: A
Explanation: Runway numbers represent the magnetic heading divided by 10 and rounded to the nearest 10°. Runway 28L means the magnetic heading of approximately 280°. The reciprocal runway would be Runway 10R (100°).

---

## SECTIONAL CHART SYMBOL QUESTIONS
### (Need: FAA VFR Sectional Chart Legend excerpt)

**Q-SYMB-001**
Topic: Airspace Classification (topic_id = 264)
Exam: UAG (exam_id = 4)
Figure needed: Sectional chart legend showing obstruction symbols

Question: Refer to the chart legend. A tower symbol with the number 1549 (649) indicates:
A) The tower is 1,549 feet tall and 649 feet wide
B) The tower's MSL elevation is 1,549 feet and its AGL height is 649 feet
C) The tower is at 649 feet MSL and 1,549 feet AGL
D) The tower's AGL height is 1,549 feet and MSL elevation is 649 feet
Correct: B
Explanation: On sectional charts, obstruction heights are shown as MSL elevation (top number) and AGL height (bottom number in parentheses). So 1549 (649) means the top of the obstruction is 1,549 feet MSL, which is 649 feet above ground level. Remote pilots must avoid obstructions and maintain awareness of their height AGL.

---

*Total chart-dependent questions: 14*
*All require images before database insertion.*
*Contact: review with admin before activating.*
