# GradeUnderflow

> Because your GPA shouldn't crash.

## Project Overview

GradeUnderflow is a modern Academic Performance Intelligence Platform for engineering students. It is designed to be a clean, fast, and insightful alternative to traditional college ERP systems, providing a premium experience akin to top-tier developer tools.

### Current Version
v0.1.0

### Current Phase
Repository Foundation

### Status
In Development

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui (New York style, Zinc base)
- Framer Motion
- pnpm

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic Settings
- Uvicorn
- Ruff, Black, isort

## Folder Structure

```
gradeunderflow/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # FastAPI backend application
├── packages/
│   ├── ui/           # Shared UI components (future)
│   ├── config/       # Shared configuration (future)
│   └── types/        # Shared TypeScript types (future)
├── docs/             # Project documentation
├── docker/           # Docker configuration files
├── .github/          # GitHub Actions workflows and templates
└── .vscode/          # VS Code workspace settings
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- pnpm (v8+)
- Python (3.11+)
- Docker & Docker Compose

### Local Development Setup

1. **Clone the repository**
2. **Start the database**
   ```bash
   docker-compose up -d
   ```
3. **Setup Backend**
   ```bash
   cd apps/api
   python -m venv venv
   # activate venv (Windows: .\venv\Scripts\activate, Unix: source venv/bin/activate)
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
4. **Setup Frontend**
   ```bash
   cd apps/web
   pnpm install
   pnpm dev
   ```

## Development Commands

- `pnpm dev`: Start frontend dev server
- `pnpm lint`: Run frontend linter
- `docker-compose up -d`: Start local PostgreSQL database

## Architecture Overview

This project uses a monorepo structure to house both the frontend and backend applications, paving the way for shared packages in the future. The frontend is built on Next.js leveraging server components and modern React paradigms. The backend is a robust FastAPI service connected to a PostgreSQL database via SQLAlchemy.

## Future Roadmap Reference

See `docs/roadmap.md` for upcoming features and architectural expansions.
