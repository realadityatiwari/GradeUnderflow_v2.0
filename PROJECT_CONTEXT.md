# GradeUnderflow — Project Context

> **Purpose:** This is the repository's single source of truth for product intent, architecture, implementation state, experience standards, and contributor/AI operating rules. Update it in the same change set whenever a feature, interface convention, or delivery status materially changes.

**Last reviewed:** 2026-07-12  
**Product status:** Core product implemented; pre-production hardening and validation remain.

## 1. Product overview

GradeUnderflow is an academic intelligence platform for students. It goes beyond recording marks: students can model their semester structure, record assessment outcomes, calculate evaluation/SGPA/CGPA, forecast incomplete results, test hypothetical outcomes, and understand performance patterns through a unified dashboard and analytics experience.

### Product outcomes

- Make academic progress legible at a glance.
- Turn raw marks into understandable evaluation, GPA, prediction, and health signals.
- Show the next most useful action, not only historical reporting.
- Keep hypothetical planning separate from saved academic records.

### Primary user flow

1. Register or sign in.
2. Create a semester, then add subjects and their credits.
3. Add assessments and record assessment results as they become available.
4. Review subject evaluation, predicted grade, semester health, SGPA target, dashboard, and analytics.
5. Use What-If simulation to explore possible marks without changing persisted data.

## 2. System architecture

### Stack

| Area | Technology | Responsibility |
| --- | --- | --- |
| Web | Next.js 16, React 19, TypeScript | Authenticated application UI and public auth screens |
| UI | Tailwind CSS v4, Radix UI, Lucide, Framer Motion, Recharts | Accessible primitives, visual system, motion, charts |
| API | FastAPI, Pydantic, SQLAlchemy | REST API, validation, domain orchestration |
| Data | PostgreSQL 15, Alembic | Relational persistence and schema migrations |
| Local infrastructure | Docker Compose | PostgreSQL development service |

### Backend boundary rules

```text
Next.js client
    -> FastAPI routers (request/response and dependency injection only)
        -> services / domain engines (business logic)
            -> repositories (CRUD only)
                -> SQLAlchemy models -> PostgreSQL
```

- Routers must not contain database queries or business rules.
- Repositories are the only persistence translation boundary and must not contain business logic.
- The Evaluation engine owns mark, percentage, grade, and grade-point calculation.
- SGPA and CGPA services consume evaluation outputs; they do not duplicate grade rules.
- Prediction and What-If features are read-only calculations: simulations must never persist overrides.
- The Dashboard service is an aggregation boundary. Prefer extending its composed response over making the dashboard issue many unrelated calls.

## Repository principles

GradeUnderflow follows five non-negotiable principles:

1. **Dashboard is the canonical design language.** New authenticated screens should adopt its shared shells, surface hierarchy, responsive layout, and data-first visual patterns.
2. **Evaluation Engine is the single source of truth for all academic calculations.** Other services consume its outputs; they must not reimplement grading rules.
3. **Frontend renders data but does not own academic logic.** Keep formulas, predictions, and validation of academic rules in the backend domain services.
4. **Every feature should reuse existing components before creating new ones.** Prefer the established `ui`, `ds`, and `Shell` component libraries; add primitives only when no appropriate shared abstraction exists.
5. **Consistency is preferred over novelty.** Favor established naming, API, interaction, and visual conventions over one-off patterns.

### Domain model

```text
User
  └─ Semester (PLANNED | CURRENT | COMPLETED)
       └─ Subject (THEORY | LABORATORY | PROJECT)
            └─ Assessment
                 └─ AssessmentResult (NOT_STARTED | SUBMITTED | CHECKED)
```

- Entity IDs are UUIDs.
- A semester's deletion cascades to subjects, assessments, and results.
- Academic year is validated as `YYYY-YY`.
- Assessment has a definition (type, title, max marks, weightage) and an optional one-to-one result.

### API and client conventions

- API base prefix: `/api/v1`; OpenAPI is exposed at `/api/v1/openapi.json`.
- Authentication uses Bearer JWTs. The client Axios instance reads `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:8000/api/v1`.
- Protected routes include semesters, subjects, assessments, evaluation, SGPA, prediction, dashboard, and analytics.
- Core intelligence endpoints include subject evaluation/prediction/target, semester SGPA/target-SGPA/academic-health/simulation, dashboard aggregation, and analytics views.
- Keep schema types synchronized with service responses and frontend service interfaces.

## 3. Current implementation status

### Implemented

| Capability | State | Notes |
| --- | --- | --- |
| Authentication | Implemented | Register/login, JWT handling, protected application shell |
| Academic structure | Implemented | Semester, subject, assessment, and result CRUD flows |
| Evaluation | Implemented | Subject evaluation plus SGPA and CGPA domain services |
| Prediction | Implemented | Missing-score prediction, target grade/SGPA, academic health, and non-persistent What-If simulation |
| Dashboard | Implemented | Aggregated academic overview, charts, action center, insights, progress, and prediction summary |
| Analytics | Implemented | Overview, trends, distribution, comparison, radar/timeline/heatmap interfaces |
| Empty/loading states | Implemented | Guided setup states and skeleton/loading components across primary screens |
| Database foundation | Implemented | SQLAlchemy models, Alembic migrations, PostgreSQL Compose service, demo seeder |
| Reports and attendance | Not implemented | Present in navigation as disabled “Soon” destinations |

### Delivery assessment

The end-to-end core workflow is present in the codebase. Treat the project as a **feature-complete prototype / pre-production application**, not a released production service: automated tests, delivery automation, operational safeguards, and full end-to-end verification are not yet established in repository configuration.

### Project health

| Area | Status |
| --- | --- |
| Backend | Stable |
| Frontend | Stable |
| Dashboard | Mature |
| Analytics | UI polish |
| Testing | Needs improvement |
| Security | Good baseline; authorization audit pending |
| Documentation | Excellent |

## 4. Design system rules

### Visual direction

The authenticated product is a focused, dark academic command center: zinc/near-black surfaces, restrained borders, indigo as the primary signal color, and selective semantic emphasis. It should feel calm, precise, and data-forward rather than decorative.

- Use existing shared primitives before introducing a new component: `components/ui`, `components/ds`, and `components/Shell`.
- Use `DashboardContainer`, `DashboardSurface`, `DashboardMetricCard`, `DashboardSection`, and `DashboardEmptyState` for dashboard-style pages.
- Keep the established surface language: `zinc-950` background, low-opacity white borders, dark translucent panels, soft indigo radial glow, and rounded `xl`/`2xl` containers.
- Use indigo for active navigation, primary actions, selected state, and informational emphasis; reserve emerald, amber, and red for meaningful success/warning/risk signals.
- Use Lucide icons; match the existing compact icon sizes (`h-4 w-4` for controls) and never substitute emoji for product icons.
- Preserve token-driven base styles in `src/styles/globals.css`. Do not hard-code a competing light theme or one-off color system.
- Prefer existing `Button`, `Input`, `Dialog`, `Tabs`, `Accordion`, and chart helpers rather than rebuilding accessible behavior.

### Layout and typography

- Standard page content: centered `max-w-[1440px]`, responsive horizontal padding, and `space-y-5` vertical rhythm.
- Use a consistent hero/header surface for principal authenticated screens: eyebrow label, large concise title, supporting sentence, and a focused primary action when appropriate.
- Use responsive grids: one column first, then `md` and `xl` enhancements. Do not make critical data dependent on hover or desktop-only layout.
- Use dense but readable hierarchy: small uppercase tracking for labels, large tight-tracked titles, and muted supporting copy.
- Respect both existing theme tokens and the app shell’s dark visual contract when adding components.

## 5. UI/UX guidelines

- Explain academic signals in plain language. A score, forecast, or recommendation must include enough context to be actionable.
- Never present a prediction as an official result. Label forecasts, confidence, assumptions, and simulations distinctly from recorded marks.
- Preserve data safety: destructive actions require confirmation and must name the cascaded impact.
- Every data-dependent screen needs loading, empty/setup, error, and populated states. Use the existing shell components where possible.
- Make first-run experience instructional: direct students to create a semester, subject, or assessment rather than displaying an empty chart.
- After a create, update, or delete, refresh the relevant view and keep the user in context.
- Prefer direct text over unexplained icon-only controls; supply accessible labels for controls when text is impractical.
- Charts must have a clear title, readable legend/tooltip, semantic colors, and a useful no-data state.
- Maintain mobile usability. The desktop sidebar is intentionally hidden below `md`; do not add primary-only navigation that becomes unreachable on smaller displays.

## 6. Implementation progress and quality priorities

### Current code organization

```text
apps/
  api/                  FastAPI application, services, repositories, schemas, migrations
  web/                  Next.js application, app routes, UI components, client services
docs/                   Supporting architecture, API, database, roadmap, and issue notes
docker-compose.yml      Local PostgreSQL service
```

### Pending improvements (priority order)

1. **Test coverage:** add unit tests for grading, SGPA/CGPA, prediction, target, and simulation services; add API integration tests and frontend smoke/E2E coverage for the primary user flow.
2. **Authorization audit:** verify user ownership is enforced at every resource lookup, including nested and intelligence endpoints, to prevent cross-account access by UUID.
3. **Error experience:** replace console-only request failures with consistent user-visible error states, retry paths, and form-level validation feedback.
4. **Production readiness:** add CI for lint, type-check, tests, build, migration checks, dependency/security checks, environment documentation, observability, backups, and deployment configuration.
5. **Documentation alignment:** update the legacy `docs/roadmap.md` (which still calls the project a Phase 0.1 foundation) and expand API documentation to include all implemented prediction target endpoints.
6. **Security modernization:** keep the temporary `bcrypt==3.2.2` compatibility pin documented; plan migration away from unmaintained `passlib` or validate a modern supported password-hashing approach.
7. **Feature completion:** implement Reports/export and Attendance only when their data models, UX, access controls, and presentation requirements are defined.

## 7. AI and contributor instructions

### Operating principles

- Read this document and relevant adjacent implementation before changing behavior. Do not rely on stale supporting docs when code states otherwise.
- Make the smallest coherent change. Preserve the router → service → repository boundary and the shared UI system.
- Never invent grade formulas, prediction assumptions, API fields, or database constraints. Locate the owning service/schema and extend it deliberately.
- For new protected endpoints, authenticate the user and enforce ownership of every referenced parent/resource before returning or mutating data.
- Treat all user academic data as private. Do not log tokens, passwords, personal records, or credentials. Never commit `.env` files or secrets.
- Keep persisted academic facts separate from derived calculations and user simulations.
- Reuse existing typed frontend services and components; do not add untyped `any` data paths when a schema/interface can be defined.
- Match visual conventions exactly enough that new screens feel native: dark surfaces, indigo signal color, shared primitives, responsive layouts, and meaningful empty/loading/error states.
- Update `PROJECT_CONTEXT.md` whenever the source of truth would otherwise become inaccurate.

### Never Do

For AI agents and contributors:

- Never duplicate evaluation formulas.
- Never redesign the Dashboard without explicit instruction.
- Never move business logic into React.
- Never hardcode grades.
- Never bypass repositories.
- Never create another design system.
- Never break API compatibility.
- Never remove accessibility.
- Never ignore responsive behavior.

### Verification expectations

- For backend changes: run relevant formatting/lint/type checks, migration checks when models change, and targeted tests.
- For frontend changes: run lint and production build; manually verify responsive populated, loading, empty, and error states.
- For logic that affects grades or predictions: include representative boundary cases and explain formula/assumption changes in the pull request or commit message.
- Do not modify generated lockfiles, migrations, or unrelated files unless the change requires them.

## 8. Definition of Done

A feature is complete only when:

- [ ] The required backend implementation is complete, including authorization and validation for protected or persisted data.
- [ ] The required frontend implementation is complete and uses the established shared components and design language.
- [ ] The experience is responsive across supported viewport sizes.
- [ ] Interactive controls, labels, focus behavior, and semantic structure meet accessibility expectations.
- [ ] A loading state is present for asynchronous data or actions.
- [ ] A useful empty/setup state is present when no data exists.
- [ ] A user-visible error state and recovery path are present for failed requests or invalid input.
- [ ] Relevant lint, type, formatting, and test checks pass.
- [ ] The production build passes.
- [ ] Manual browser QA is completed for the affected user flow, including populated, loading, empty, and error states.
- [ ] `PROJECT_CONTEXT.md` is updated when the feature changes the project’s architecture, scope, status, conventions, or roadmap.

## 9. Presentation checklist

Use this checklist before a demo, review, or showcase.

- [ ] Database is running, migrations are current, and the application configuration has a valid `SECRET_KEY`.
- [ ] A prepared demo account/data set exists with a current semester, multiple subjects, mixed assessment states, and enough history for analytics.
- [ ] Demonstrate the complete narrative: onboarding → semester → subject → assessment/result → evaluation/prediction → dashboard → analytics → What-If simulation.
- [ ] Clearly distinguish recorded results from forecasts and hypothetical simulations.
- [ ] Show at least one useful recommendation/action and explain its academic impact.
- [ ] Demonstrate an empty/setup state or be prepared to explain the first-run experience.
- [ ] Confirm responsive behavior and check labels, values, charts, and contrast at presentation resolution.
- [ ] Avoid exposing real student data, access tokens, connection strings, or secrets.
- [ ] Keep Reports and Attendance framed as planned features, not shipped functionality.

## 10. Future roadmap

### Near-term: harden the core

- Establish automated test, lint, type, build, and migration validation in CI.
- Complete authorization/security audit and consistent error handling.
- Align existing roadmap/API documentation with the implemented application.
- Define production deployment, monitoring, backup, and data-retention practices.

### Next product capabilities

- **Reporting and export:** PDF/CSV academic reports, transcripts, and shareable charts.
- **Attendance:** a properly modeled attendance workflow integrated with academic planning.
- **AI academic advisor:** contextual, actionable advice using the student's recorded evaluation and prediction data; recommendations must be transparent and non-authoritative.
- **Gamification:** consistency streaks, milestones, and badges that support—not distract from—learning goals.

### Long-term platform direction

- University/organizational support with tenancy, role-based access, official course structures, syllabus syncing, and marks integration.
- Strong privacy, governance, and audit controls appropriate for institutional academic records.
- Configurable grading policies so the product can accurately support different universities without weakening the core evaluation boundary.

## 11. Architecture decisions

### ADR-001 — Business logic belongs exclusively in backend services

**Reason:** Avoid duplicated academic formulas. The frontend renders typed API data, while backend domain services own calculations and rules.

---

### ADR-002 — Dashboard is the visual design system

**Reason:** Prevent multiple competing UI styles. New authenticated screens should extend the Dashboard’s established shells, shared components, surface language, and interaction patterns.

---

### ADR-003 — Prediction is always read-only

**Reason:** Never allow hypothetical calculations to mutate academic records. Predictions and What-If simulations must operate on derived data and leave persisted assessment data unchanged.

## 12. Canonical references

- Project entry point: `README.md`
- Architecture detail: `docs/architecture.md`
- Data model reference: `docs/database.md`
- Current endpoint summary: `docs/api.md`
- Known dependency compatibility issue: `docs/KNOWN_ISSUES.md`
- Aspirational feature scope: `docs/FutureScope.md`

When these conflict with current implementation, code and this document govern; update the stale reference as part of the relevant work.
