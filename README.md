# GradeUnderflow

An advanced **Academic Intelligence Platform** designed to help students track, predict, and optimize their academic trajectory. Move beyond simple GPA calculation with predictive modeling, health scoring, and actionable insights.

## Features
- **Intelligent Dashboard:** A centralized, aggregated view of your academic health, upcoming targets, and active predictions.
- **Evaluation & SGPA Engines:** Strict mathematical evaluation of assessments, dynamically calculating internal marks, required external targets, and final SGPA/CGPA.
- **Prediction Engine:** Forecasts missing assessment scores based on historical data and provides "What-If" simulations to understand how hypothetical marks impact your final GPA without altering real data.
- **Analytics & History:** Visual distribution of grades and performance across cohorts and past semesters.
- **Demo Seeder:** Instantly populate the platform with a fully graded demo account to explore all features instantly.

## Architecture
GradeUnderflow follows a strictly decoupled service-oriented architecture.
- **Frontend:** Next.js (TypeScript, React) with a premium UI driven by Framer Motion and modern design principles.
- **Backend:** FastAPI (Python) enforcing rigid separation between the `Router`, `Service (Engines)`, and `Repository` layers.
- **Database:** PostgreSQL interacting through SQLAlchemy ORM and Pydantic schemas.

*For detailed architectural documentation, see [Architecture.md](docs/Architecture.md).*

## Tech Stack
- **Web App:** Next.js, React, Tailwind CSS, Lucide Icons, Recharts, Framer Motion
- **API Server:** Python 3.10+, FastAPI, SQLAlchemy, Pydantic, Uvicorn
- **Database:** PostgreSQL (Dockerized)
- **Tooling:** Ruff (Linter), TypeScript (Compiler)

## Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/GradeUnderflow_v2.0.git
   cd GradeUnderflow_v2.0
   ```

2. **Start the Database (Docker):**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup:**
   ```bash
   cd apps/api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   **Configure `.env`** in `apps/api/`:
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=gradeunderflow
   POSTGRES_HOST=127.0.0.1
   POSTGRES_PORT=5432
   ```
   **Initialize Database & Run Seeder:**
   ```bash
   alembic upgrade head
   python -m app.db.seed
   ```
   **Start API Server:**
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```

4. **Frontend Setup:**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```
   Visit `http://localhost:3000` to access the application.

## Documentation
- [Architecture Overview](docs/Architecture.md)
- [Database Schema](docs/Database.md)
- [API Endpoints](docs/API.md)
- [Future Scope](docs/FutureScope.md)

## License
MIT License.
