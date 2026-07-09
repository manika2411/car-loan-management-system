# AutoDrive — Vehicle Loan Management System

A full-stack vehicle loan management platform covering the complete lifecycle from
lead capture to loan disbursement and EMI repayment — built with **Spring Boot**
(backend) and **React + Vite** (frontend).

## Overview

AutoDrive supports four roles — **Admin**, **Sales Agent**, **Loan Officer**, and
**Customer** — each with a tailored dashboard and permissions, covering:

- Lead capture, status tracking, and per-lead activity notes
- Vehicle catalogue management (add/edit/delete)
- Customer KYC document upload and review
- Loan application submission with AI-assisted underwriting recommendations
- Application approval/rejection workflow
- Automatic loan account and EMI schedule generation on approval
- EMI payment tracking with overdue detection
- Admin user management with role assignment
- OTP-based email verification on signup

## Tech Stack

**Backend**
- Java 17, Spring Boot
- Spring Security with JWT authentication (stateless, role-based access control)
- Spring Data JPA / Hibernate
- MySQL (or your configured RDBMS)
- Hugging Face Inference API integration for AI loan recommendations

**Frontend**
- React (Vite)
- React Router
- Axios
- Recharts (dashboard visualizations)
- Lucide React (icons)

## Project Structure

```
├── loan-backend/          # Spring Boot REST API
│   └── src/main/java/com/loan/backend/
│       ├── controller/    # REST endpoints
│       ├── service/       # Business logic interfaces
│       ├── serviceimpl/   # Business logic implementations
│       ├── entity/        # JPA entities
│       ├── repository/    # Spring Data repositories
│       └── dto/           # Request/response payloads
│
├── loan-frontend/         # React (Vite) SPA
│   └── src/
│       ├── pages/         # Route-level page components
│       ├── components/    # Shared UI components (Navbar, ProtectedRoute)
│       └── services/      # Axios API call wrappers
│
└── .gitignore
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- MySQL (or update `application.properties` for your database)

### Backend Setup

```bash
cd loan-backend
```

Create `src/main/resources/application.properties` (see
`application.properties.example` for the required keys) with your own:
- Database connection details
- `jwt.secret` and `jwt.expiration`
- SMTP credentials (for OTP email delivery)
- Hugging Face API token (for AI recommendations)

Then run:

```bash
./mvnw spring-boot:run
```

By default, the API starts on `http://localhost:8080`. This is not fixed —
if port 8080 is already occupied on your machine, you can run the app on
any other free port by adding this line to `application.properties`
(replace `<port>` with whatever port number you want to use, e.g. `8090`):

```properties
server.port=<port>
```

**Important:** if you do this, `loan-frontend/src/api.js` must be updated
to point its `baseURL` at that same port — the frontend and backend ports
always have to match, regardless of which one you pick.

### Frontend Setup

```bash
cd loan-frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173`.

## API Documentation

Once the backend is running, view the full OpenAPI spec at
(replace `8080` with your configured port if you changed `server.port`):

```
http://localhost:8080/v3/api-docs
```

Or the interactive Swagger UI:

```
http://localhost:8080/swagger-ui/index.html
```

## Roles & Access

| Role          | Access                                                              |
|---------------|----------------------------------------------------------------------|
| Admin         | Full access — users, roles, vehicles, leads, applications           |
| Sales Agent   | Lead management and notes                                           |
| Loan Officer  | Application review, AI recommendation, approve/reject               |
| Customer      | KYC upload, loan application, EMI schedule, payments                |

## Known Limitations / Roadmap

- No refresh token — JWT expires after 24h with no silent renewal
- Document-level KYC verification not yet implemented (application-level only)
- Local filesystem storage for uploaded documents (not cloud-backed)
- No automated notification to Loan Officers on lead conversion
- No payment gateway integration (payments are recorded, not processed)

## License

This project is for educational/demonstration purposes.
