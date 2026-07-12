# API Documentation

The GradeUnderflow API is built on FastAPI and follows RESTful conventions with JWT-based authentication.

## Authentication Endpoints
- `POST /api/v1/auth/login`
  Authenticates a user and returns an `access_token`.
- `POST /api/v1/auth/register`
  Registers a new student account.

## Core Entities
All endpoints below require a valid `Bearer` token in the `Authorization` header.

### Semesters
- `GET /api/v1/semesters`
- `POST /api/v1/semesters`
- `GET /api/v1/semesters/{id}`
- `PUT /api/v1/semesters/{id}`
- `DELETE /api/v1/semesters/{id}`

### Subjects
- `GET /api/v1/semesters/{semester_id}/subjects`
- `POST /api/v1/semesters/{semester_id}/subjects`
- `PUT /api/v1/subjects/{id}`
- `DELETE /api/v1/subjects/{id}`

### Assessments
- `GET /api/v1/subjects/{subject_id}/assessments`
- `POST /api/v1/subjects/{subject_id}/assessments`
- `PUT /api/v1/assessments/{id}`
- `DELETE /api/v1/assessments/{id}`

## Intelligence & Aggregation Engines

### Evaluation & SGPA
- `GET /api/v1/evaluation/subjects/{subject_id}`
  Retrieves internal/external breakdown and final grade point for a subject.
- `GET /api/v1/sgpa/semesters/{semester_id}`
  Retrieves the overall SGPA calculation for a semester.

### Prediction
- `GET /api/v1/prediction/subjects/{subject_id}/prediction`
  Forecasts missing assessment scores and predicts the final subject grade.
- `GET /api/v1/semesters/{semester_id}/academic-health`
  Generates a composite 0-100 score indicating academic trajectory.
- `POST /api/v1/prediction/semesters/{semester_id}/simulate`
  Executes a "What-If" simulation across the semester using hypothetical marks.

### Dashboard & Analytics
- `GET /api/v1/dashboard`
  Aggregates current GPA, predictions, and health across the active semester.
- `GET /api/v1/analytics/overview`
  Aggregates performance distribution and trends across historical semesters.
