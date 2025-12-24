# Task Manager - Full Stack Application

A full-stack project task management application built for Hahn Software Morocco End of Studies Internship 2026.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Security**: Spring Security with JWT Authentication
- **Database**: PostgreSQL
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6

### Database
- **PostgreSQL 15**

## ✨ Features

### Authentication
- ✅ User registration with email and password
- ✅ User login with JWT token authentication
- ✅ Protected routes (all API routes except login/register require authentication)
- ✅ Persistent login sessions

### Projects Management
- ✅ Create new projects with title and optional description
- ✅ View list of all user projects
- ✅ View project details
- ✅ Edit project information
- ✅ Delete projects (with all associated tasks)

### Tasks Management
- ✅ Create tasks with title, description, and due date
- ✅ Mark tasks as completed/incomplete
- ✅ Edit task details
- ✅ Delete tasks
- ✅ Filter tasks by status (All, Pending, Completed)

### Project Progress
- ✅ Display total tasks count
- ✅ Display completed tasks count
- ✅ Visual progress bar with percentage
- ✅ Real-time progress updates

### UI/UX Improvements
- ✅ Modern Landing Page
- ✅ Collapsible Sidebar Navigation
- ✅ Global Search (Cmd+K)
- ✅ Responsive Design
- ✅ Dark Mode Support (System default)
- ✅ Beautiful shadcn/ui components

### Bonus Features
- ✅ Docker Compose setup for easy deployment
- ✅ Clean architecture with separation of concerns
- ✅ Input validation on both frontend and backend
- ✅ Comprehensive error handling
- ✅ Pagination support (API ready)
- ✅ Search/filter functionality (API ready)
- ✅ Environment variable configuration

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 15 or higher (or Docker)
- Maven 3.9+

### Configuration

Before running the application, you need to set up the environment variables.

1. **Backend**: Copy `backend/.env.example` to `backend/.env` and update the values if necessary.
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Frontend**: Copy `frontend/.env.example` to `frontend/.env` and update the values if necessary.
   ```bash
   cp frontend/.env.example frontend/.env
   ```

### Option 1: Running with Docker (Recommended)

The easiest way to run the entire application stack:

```bash
# Clone the repository
git clone https://github.com/Petrichor0314/taskmanager.git
cd taskmanager

# Ensure .env files are created as described above

# Start all services with Docker Compose
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8080
- Frontend on port 5173

Access the application at: http://localhost:5173

### Option 2: Running Locally

#### Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE taskmanager;
```

2. Ensure `backend/.env` is configured correctly for your local database.

#### Backend Setup

```bash
cd backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The backend will start on http://localhost:8080

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on http://localhost:5173

## 📝 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Projects Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects for current user |
| GET | `/api/projects/{id}` | Get project by ID |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project |
| GET | `/api/projects/search?q=` | Search projects by title |

### Tasks Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/{projectId}/tasks` | Get all tasks for a project |
| GET | `/api/projects/{projectId}/tasks/{taskId}` | Get task by ID |
| POST | `/api/projects/{projectId}/tasks` | Create a new task |
| PUT | `/api/projects/{projectId}/tasks/{taskId}` | Update a task |
| PATCH | `/api/projects/{projectId}/tasks/{taskId}/toggle` | Toggle task completion |
| DELETE | `/api/projects/{projectId}/tasks/{taskId}` | Delete a task |
| GET | `/api/projects/{projectId}/tasks/filter?completed=` | Filter tasks by status |

## 🔐 Default Test Users

The application seeds two default users on startup:

| Email | Password |
|-------|----------|
| test@example.com | password123 |
| admin@hahn.com | admin123 |

## 📁 Project Structure

```
hahn/
├── backend/
│   ├── src/main/java/com/hahn/taskmanager/
│   │   ├── config/           # Configuration classes
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA entities
│   │   ├── exception/        # Custom exceptions & handlers
│   │   ├── repository/       # JPA repositories
│   │   ├── security/         # JWT & Security config
│   │   └── service/          # Business logic
│   ├── src/main/resources/
│   │   └── application.yml   # Application configuration
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── contexts/         # React contexts
│   │   ├── lib/              # Utilities & API client
│   │   ├── pages/            # Page components
│   │   └── types/            # TypeScript types
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🎥 Demo Video


## 📄 License

This project is created for Hahn Software Morocco End of Studies Internship evaluation.

---
