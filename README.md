# FAAExaminations.com

A production-ready exam preparation platform for FAA written knowledge tests —
**Private Pilot (PAR)**, **Instrument Rating (IRA)**, and **Commercial Pilot (CAX)**.

- Node.js / Express REST API
- PostgreSQL
- React (Vite) + Recharts
- JWT authentication (student + admin roles)
- Quiz engine with **study mode**, **timed exam simulation**, flagging, resume, question navigator
- Progress dashboard with **pass-readiness predictor**, score trend chart, weak-topic breakdown
- Admin panel to create / edit / upload / deactivate questions, manage users
- CSV seed script for bulk-importing questions

---

## Project structure

```
faaexaminations/
├── client/                      # React (Vite) front-end
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/client.js
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── ResetPassword.jsx
│       │   ├── Dashboard.jsx
│       │   ├── ExamList.jsx
│       │   ├── QuizRunner.jsx
│       │   ├── Result.jsx
│       │   ├── History.jsx
│       │   ├── Profile.jsx
│       │   └── admin/
│       │       ├── AdminLayout.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminQuestions.jsx
│       │       ├── AdminEditor.jsx
│       │       └── AdminUsers.jsx
│       └── styles/index.css
│
├── server/                      # Express API
│   ├── package.json
│   ├── .env.example
│   ├── uploads/                 # multer upload folder (created on boot)
│   └── src/
│       ├── index.js             # Express app entry
│       ├── config/db.js         # Postgres pool
│       ├── middleware/
│       │   ├── auth.js
│       │   └── errorHandler.js
│       ├── utils/helpers.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── quizController.js
│       │   ├── questionController.js
│       │   ├── resultController.js
│       │   └── userController.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── quizzes.js
│       │   ├── questions.js
│       │   ├── results.js
│       │   └── users.js
│       └── scripts/
│           ├── migrate.js
│           ├── createAdmin.js
│           └── seed.js          # imports CSV → questions table
│
└── database/
    └── schema.sql
```

---

## Prerequisites

- **Node.js 18+**
- **PostgreSQL 13+** (local or remote)
- A CSV of FAA questions (the project ships with `faa_all_questions.csv`)

---

## 1. Install & configure the backend

```bash
cd server
npm install
cp .env.example .env
# Open .env and set DATABASE_URL + JWT_SECRET
```

Create the database, then run the schema migration:

```bash
# Create an empty database
createdb faaexaminations

# Apply schema.sql (creates tables + seeds the 3 exam categories)
npm run migrate
```

Import the question bank from CSV:

```bash
# Default path: ../../project/faa_all_questions.csv
node src/scripts/seed.js

# Or specify a custom path:
node src/scripts/seed.js /path/to/your/faa_all_questions.csv
```

The seed script:
- Truncates the `questions` and `topics` tables (idempotent re-seeding)
- Parses `quiz_name` strings like
  `"FAA Private Pilot Airplane (PAR) - Airplane Engines, Systems & Instruments Quiz 4"`
  into an exam code (`PAR`) and a topic (`Airplane Engines, Systems & Instruments`)
- Auto-creates topic rows as it goes
- Skips any row without a question/answer/choice mismatch
- Prints a summary table at the end

Create your first admin user:

```bash
npm run create-admin admin@faaexaminations.com Password123 "Site Admin"
```

Start the API:

```bash
npm run dev       # nodemon (development)
# or
npm start         # production
```

API is now live at `http://localhost:5000` — try `http://localhost:5000/api/health`.

---

## 2. Install & start the front-end

```bash
cd ../client
npm install
npm run dev
```

The Vite dev server runs at `http://localhost:3000` and proxies `/api` and
`/uploads` to `http://localhost:5000` (configured in `vite.config.js`).

Open `http://localhost:3000`, register a user, and start practicing.

Log in with the admin credentials you created to access `/admin`.

---

## API overview

All authenticated endpoints require `Authorization: Bearer <JWT>`.

### /api/auth
| Method | Path                       | Description              |
|-------:|----------------------------|--------------------------|
| POST   | `/register`                | Create a new account     |
| POST   | `/login`                   | Email + password login   |
| POST   | `/logout`                  | Stateless logout         |
| GET    | `/me`                      | Current user profile     |
| POST   | `/password/forgot`         | Request reset token      |
| POST   | `/password/reset`          | Reset with token         |

### /api/quizzes
| Method | Path                                | Description                        |
|-------:|-------------------------------------|------------------------------------|
| GET    | `/exams`                            | Available exam categories          |
| GET    | `/exams/:code/topics`               | Topics within an exam              |
| POST   | `/start`                            | Create a new session (study/exam)  |
| GET    | `/sessions`                         | Current user's sessions            |
| GET    | `/sessions/:id`                     | Session + questions (answers hidden in exam mode) |
| POST   | `/sessions/:id/answer`              | Save an answer / flag / index      |
| POST   | `/sessions/:id/submit`              | Grade and complete the session     |
| POST   | `/sessions/:id/abandon`             | Abandon without grading            |

### /api/results
| Method | Path               | Description                            |
|-------:|--------------------|----------------------------------------|
| GET    | `/`                | User's past results                    |
| GET    | `/:id`             | Single result + per-question review    |
| GET    | `/dashboard`       | Aggregated stats + pass predictor      |

### /api/questions  (admin only)
| Method | Path               | Description                      |
|-------:|--------------------|----------------------------------|
| GET    | `/`                | Paginated, filterable, searchable|
| GET    | `/:id`             | Single question                  |
| POST   | `/`                | Create                           |
| PUT    | `/:id`             | Update                           |
| DELETE | `/:id`             | Soft-deactivate                  |
| POST   | `/upload`          | `multipart/form-data` image upload |

### /api/users
| Method | Path               | Description                         |
|-------:|--------------------|-------------------------------------|
| PUT    | `/me`              | Update own profile / password       |
| GET    | `/`                | List users (admin)                  |
| GET    | `/:id`             | Single user (admin)                 |
| PUT    | `/:id`             | Update role / status (admin)        |
| GET    | `/admin/stats`     | Admin dashboard tiles (admin)       |

---

## Pass-readiness algorithm

`server/src/controllers/resultController.js → computeReadiness()`

The readiness score (0–100) is computed from:

1. **Recent average score** (scaled against the exam's passing line — 70 readiness at passing line, ±20 per ±15 points)
2. **Coverage bonus** — up to +8 when the user has completed ≥10 exams
3. **Weak-topic penalty** — up to −12 for topics below 60% with ≥5 answered questions
4. **Confidence label** based on total attempts (low / medium / high)

The dashboard surfaces the score, a human-readable label
(`More Practice Needed` → `Building Competency` → `Nearly Ready` → `Exam Ready`),
plain-language advice, and the input breakdown so users understand the number.

---

## Production checklist

- Set a strong `JWT_SECRET` (`openssl rand -hex 64`)
- Use a managed Postgres (e.g. RDS, Supabase, Neon) and set `DATABASE_URL`
- Run `cd client && npm run build`, then serve `client/dist` behind a CDN
- Point your API domain at the `server/` process behind HTTPS
- Hook the password-reset controller up to your email provider (SendGrid, SES, Postmark)
- Wire Stripe: `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` are already in `.env.example`; a checkout endpoint is the natural next step in `userController.js`

---

## License

Internal / proprietary to FAAExaminations.com. Question content is the property of its original rights holders.
