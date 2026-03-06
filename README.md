# Vehicle Identity Authorization System

## Project Overview

Vehicle Identity Authorization System verifies whether a vehicle is authorized to interact with connected mobility platforms by combining vehicle identity, owner registration, and insurance compliance into a single workflow. The project includes a FastAPI backend for identity management and authorization decisions, plus a lightweight React dashboard for live demonstration.

## System Features

- Owner registration
- Vehicle registration
- Insurance policy management
- Automated authorization decision engine
- Demo dashboard interface

## Technology Stack

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

### Frontend

- React
- Axios

## System Architecture

The system follows a modular architecture with clearly separated layers:

- API Layer: FastAPI route handlers expose REST endpoints for registration, listing, health checks, and authorization.
- Service Layer: Business rules and authorization logic are implemented in dedicated service modules.
- Data Models: SQLAlchemy ORM models define owners, vehicles, insurance policies, and relationships.
- Database Layer: SQLite with SQLAlchemy session management provides persistent storage.
- Frontend Interface: A React dashboard guides judges through the complete demo workflow.

## API Endpoints

- `POST /owners`
- `POST /vehicles`
- `POST /insurance`
- `GET /vehicles/{id}/authorization`
- `GET /owners`
- `GET /vehicles`
- `GET /insurance`
- `GET /health`

## Setup Instructions

### Backend Setup

1. Move into the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:

   ```bash
   uvicorn app.main:app --reload
   ```

4. Open API documentation:

   [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup

1. Move into the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the frontend:

   ```bash
   npm start
   ```

## Demo Workflow

1. Register an Owner.
2. Register a Vehicle linked to that owner.
3. Add an Insurance policy.
4. Run Authorization Check.
5. System returns `AUTHORIZED` or `BLOCKED`.
