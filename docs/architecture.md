# Architecture Overview

GradeUnderflow is built as a strict decoupling between generic data persistence and intelligent analysis. The platform avoids monolithic business logic and instead relies on distinct, isolated engines that feed upwards into aggregation layers.

## High-Level Flow
`Frontend (Next.js)` ➔ `API Routers (FastAPI)` ➔ `Service Engines` ➔ `Repository Layer` ➔ `PostgreSQL`

### 1. Repository Layer
The foundation of the application. It acts as the singular translation point between Python `Pydantic`/`SQLAlchemy` models and PostgreSQL schemas.
- **Rule:** The repository layer contains zero business logic. It only executes CRUD operations.

### 2. Service Layer & Engines
The service layer contains the core logic grouped into dedicated functional engines:

- **Evaluation Engine:** The sole owner of computing raw marks, percentages, grades, and grade points for a specific Subject.
- **SGPA Engine:** Consumes the Evaluation Engine outputs to calculate the total Semester Grade Point Average.
- **CGPA Engine:** Consumes the SGPA Engine outputs to compute the Cumulative GPA across all active semesters.
- **Prediction Engine:** A purely predictive module. It forecasts missing assessments, evaluates `Academic Health`, and generates `What-If` simulation data by consuming Evaluation and SGPA engines without saving state to the database.
- **Analytics Engine:** Handles historical data tracking, grade distributions, and performance trending logic.

### 3. Dashboard Aggregator
The `Dashboard` service is an intentional architectural bottleneck. It prevents the frontend from firing dozens of simultaneous API requests. Instead, it aggregates data across the Evaluation, SGPA, Prediction, and Analytics engines into a singular, unified `OverviewData` matrix returned in one optimized network call.

### 4. Router Layer
The FastAPI `routers` map directly to RESTful endpoints. They parse incoming requests, inject database dependencies (using `Depends()`), and pass the parameters down to the respective engines. No database queries or business logic exist in this layer.
