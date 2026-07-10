# GradeUnderflow API

## Purpose
This document details the REST API specifications for GradeUnderflow.

## Scope
It covers endpoint structures, authentication mechanisms, request/response formats, and error handling.

## Planned Future Content
- Complete OpenAPI schema reference
- Authentication flow (e.g., OAuth2, JWT)
- Rate limiting rules
- Pagination and filtering conventions
- WebSocket integrations (if applicable)

## Initial Project Notes
- API framework: FastAPI
- Prefix: `/api/v1`
- Documentation: Swagger UI will be automatically generated at `/api/v1/docs`.
- Current Endpoints:
  - `GET /api/v1/health`: Basic health check returning `{"status": "ok"}`.
