# Inventory and Order Management System

## Overview

A full-stack, containerized web application designed for comprehensive inventory, customer, and order management. The system is built to handle core business operations, including real-time stock tracking, automatic order total calculation, and strict inventory validation to prevent overselling.

## Technology Stack

- Frontend: React 18 (Vite), React Router, Axios
- Backend: Python, FastAPI, SQLAlchemy, Alembic
- Database: PostgreSQL 16
- Containerization: Docker, Docker Compose

## Project Structure

inventory-order-management/
├── backend/            # FastAPI application, SQLAlchemy models, routers, and tests
├── frontend/           # React frontend application (Vite build system)
├── docker-compose.yml  # Multi-container orchestration configuration
└── docs/               # Additional documentation

## Core Features and Business Logic

The application enforces the following strict business rules at the database and application layers:

- Product Management: Supports full CRUD operations. SKUs are enforced as unique constraints.
- Customer Management: Supports full CRUD operations. Email addresses are enforced as unique constraints.
- Order Management: Handles order placement and cancellation.
- Inventory Validation: Product stock cannot drop below zero. Orders are rejected immediately if any line item exceeds available inventory.
- Automatic Deductions: Placing an order automatically deducts the respective product quantities from the inventory.
- Automatic Calculations: Total order amounts are calculated server-side based on the current product price to prevent client-side spoofing.
- Transactional Integrity: Order placement and stock deduction occur within a single database transaction to prevent data corruption during partial failures.
- Restorations: Deleting or cancelling an order automatically restores the held stock back into the inventory.

## Prerequisites

To run this project, ensure you have the following installed on your system:
- Docker Desktop
- Git

To run the application manually without Docker, you will need:
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- A local instance of PostgreSQL

## Running the Application (Recommended)

The recommended approach to run the entire stack is via Docker Compose, which automatically builds the frontend, backend, and provisions the PostgreSQL database.

1. Navigate to the project root directory.
2. Duplicate the environment template file:
   cp .env.example .env
   (On Windows Command Prompt or PowerShell, use: copy .env.example .env)

3. Build and start the containers:
   docker compose up --build -d

4. Access the application:
   - Frontend Application: http://localhost:3000
   - Backend API: http://localhost:8000
   - Interactive API Documentation (Swagger): http://localhost:8000/docs

To stop the application, run:
   docker compose down

If you wish to stop the application and wipe the database completely, run:
   docker compose down -v

## Running Services Individually (Without Docker)

Backend Setup:
1. Navigate to the backend directory: `cd backend`
2. Create and activate a virtual environment:
   python -m venv .venv
   source .venv/bin/activate (On Windows: .\.venv\Scripts\Activate.ps1)
3. Install dependencies: `pip install -r requirements.txt`
4. Copy the environment file: `cp .env.example .env`
5. Update the DATABASE_URL in the .env file to point to your local PostgreSQL instance.
6. Run the development server: `uvicorn app.main:app --reload`

Frontend Setup:
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy the environment file: `cp .env.example .env`
4. Update VITE_API_URL if your backend is running on a different port.
5. Run the development server: `npm run dev`

## API Documentation

FastAPI automatically generates interactive API documentation. Once the backend is running, navigate to `/docs` (e.g., http://localhost:8000/docs) to view and test all available endpoints.

Key API Resources:
- Products: /products
- Customers: /customers
- Orders: /orders
- Dashboard: /dashboard/summary

## Database Migrations

The application uses Alembic for database migrations. While tables are created automatically on startup for local development convenience, proper migrations should be used for schema changes.

1. Navigate to the backend directory.
2. Generate a new migration script:
   alembic revision --autogenerate -m "Description of your changes"
3. Apply the migration to the database:
   alembic upgrade head

## Testing

The backend test suite is written using pytest. Tests execute against an isolated in-memory SQLite database, so a running PostgreSQL instance is not required for testing.

1. Navigate to the backend directory.
2. Ensure dependencies are installed.
3. Run the test suite:
   pytest tests/ -v

## Environment Variables Configuration

Root Level (.env):
Used by docker-compose to configure the PostgreSQL container and pass values to the services.
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- CORS_ORIGINS
- ENVIRONMENT
- VITE_API_URL

Backend Level (backend/.env):
- DATABASE_URL: PostgreSQL connection string.
- CORS_ORIGINS: Comma-separated list of allowed frontend origins.
- ENVIRONMENT: development or production.

Frontend Level (frontend/.env):
- VITE_API_URL: The base URL of the deployed backend API.

## Deployment Guide

Backend Deployment:
The backend is designed to be deployed on platforms such as Render, Railway, or Fly.io using the provided Dockerfile.
1. Provision a managed PostgreSQL database on your hosting provider.
2. Deploy the backend repository.
3. Set the `DATABASE_URL` environment variable to your production database URL.
4. Set the `CORS_ORIGINS` environment variable to your future frontend deployment URL.

Frontend Deployment:
The frontend is built using Vite and can be deployed as a static site to Vercel or Netlify.
1. Set the build command to: `npm run build`
2. Set the publish directory to: `dist`
3. Set the `VITE_API_URL` environment variable to your deployed backend URL.

## Submission Checklist

- [ ] GitHub repository link containing frontend and backend code
- [ ] Docker Hub backend image link
- [ ] Live frontend deployment URL
- [ ] Live backend API URL
