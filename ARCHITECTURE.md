# System Architecture Documentation

## Overview

The OKR Tracker is built using a modern, scalable microservices-inspired architecture with clear separation of concerns between frontend and backend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React + Vite + Tailwind CSS + Zustand               │  │
│  │  - Pages (Login, Register, Dashboard, etc.)          │  │
│  │  - Components (UI library)                           │  │
│  │  - Features (Auth, Objectives, Teams, etc.)          │  │
│  │  - State Management (Zustand stores)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                         HTTP/REST
                            │
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express                                   │  │
│  │  - API Routes                                        │  │
│  │  - Controllers (Request handling)                    │  │
│  │  - Services (Business logic)                         │  │
│  │  - Middleware (Auth, Validation, Error handling)     │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma ORM                                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                              │
│  - Users, Teams, Memberships                                │
│  - Objectives, Key Results, Updates                         │
└─────────────────────────────────────────────────────────────┘

                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  - OpenAI API (AI Summarization)                            │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Layered Architecture

1. **API Layer (Routes)**
   - Defines endpoints
   - Handles HTTP methods
   - Applies middleware

2. **Controller Layer**
   - Request/response handling
   - Input validation
   - Delegates to services

3. **Service Layer**
   - Business logic
   - Data transformation
   - External API calls

4. **Data Access Layer (Prisma)**
   - Database queries
   - ORM operations
   - Schema management

### Module Structure

Each feature follows a consistent structure:

```
modules/
├── auth/
│   ├── auth.controller.js    # HTTP handlers
│   ├── auth.service.js        # Business logic
│   └── auth.routes.js         # Route definitions
├── teams/
├── objectives/
├── keyresults/
└── updates/
```

### Middleware Stack

1. **CORS** - Cross-origin requests
2. **Body Parser** - JSON parsing
3. **Authentication** - JWT verification
4. **Authorization** - Role-based access
5. **Validation** - Input validation
6. **Error Handler** - Centralized error handling

## Frontend Architecture

### Component Hierarchy

```
App
├── Router
│   ├── Public Routes
│   │   ├── Login
│   │   └── Register
│   └── Protected Routes
│       └── DashboardLayout
│           ├── Sidebar
│           ├── Header
│           └── Content
│               ├── Dashboard
│               ├── Objectives
│               └── Teams
```

### State Management

**Zustand Stores:**
- `auth.store.js` - User authentication state
- `theme.store.js` - UI theme (light/dark)
- `objective.store.js` - Objectives data and filters

### Data Flow

```
User Action → Component → Service → HTTP Client → Backend API
                ↓
            Update State (Zustand)
                ↓
         Re-render Component
```

## Database Schema

### Core Tables

1. **users** - User accounts
2. **teams** - Team/organization entities
3. **memberships** - User-team relationships with roles
4. **objectives** - OKR objectives
5. **key_results** - Measurable key results
6. **updates** - Progress updates and comments

### Relationships

```
User ─┬─ 1:N ─→ Membership ←─ N:1 ─┬─ Team
      │                               │
      └─ 1:N ─→ Objective ←─────────┘
                    │
                    ├─ 1:N ─→ KeyResult
                    └─ 1:N ─→ Update
```

## Security Architecture

### Authentication Flow

1. User submits credentials
2. Backend validates and hashes password
3. Generate JWT token (access + refresh)
4. Return tokens to client
5. Client stores tokens in localStorage
6. Include token in Authorization header for requests

### Authorization

- Role-based access control (RBAC)
- Three roles: OWNER, ADMIN, MEMBER
- Middleware checks user permissions per endpoint

### Security Measures

- Password hashing with bcrypt (10 rounds)
- JWT with expiration
- SQL injection prevention (Prisma)
- XSS protection (input sanitization)
- CORS configuration
- HTTPS in production

## API Design

### REST Principles

- Resource-based URLs
- HTTP methods (GET, POST, PATCH, DELETE)
- Status codes (200, 201, 400, 401, 404, 500)
- JSON request/response

### Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Performance Considerations

### Backend

- Database connection pooling
- Efficient queries with Prisma
- Selective field loading
- Proper indexing

### Frontend

- Code splitting (React Router)
- Lazy loading components
- Optimized re-renders (React.memo)
- Debounced inputs

## Scalability

### Horizontal Scaling

- Stateless backend (JWT)
- Load balancer ready
- Database connection pooling
- Containerized deployment

### Vertical Scaling

- Efficient algorithms
- Optimized queries
- Caching strategies
- Resource management

## Deployment Architecture

### Development

```
Developer → Local Server (hot reload)
```

### Production

```
                    ┌──────────────┐
Users → CDN/Nginx → │   Frontend   │
                    └──────────────┘
                           │
                    Load Balancer
                           │
                    ┌──────────────┐
                    │   Backend    │
                    │  (Container) │
                    └──────────────┘
                           │
                    ┌──────────────┐
                    │  PostgreSQL  │
                    │  (Managed)   │
                    └──────────────┘
```

## CI/CD Pipeline

```
Code Push → GitHub Actions
                │
                ├─→ Run Tests
                ├─→ Lint Code
                ├─→ Build Images
                ├─→ Push to Registry
                └─→ Deploy to Server
```

## Monitoring & Logging

### Backend Logging

- Winston logger
- File-based logs (error.log, all.log)
- Structured logging
- Request/response logging

### Error Tracking

- Centralized error handler
- Stack traces in development
- Error notifications in production

## Future Enhancements

1. **Caching Layer** - Redis for session management
2. **Message Queue** - RabbitMQ for async tasks
3. **Websockets** - Real-time notifications
4. **Microservices** - Service decomposition
5. **GraphQL** - Alternative API layer
6. **Elasticsearch** - Advanced search
7. **Analytics** - User behavior tracking
8. **Mobile App** - React Native client

## Technology Decisions

### Why Node.js?

- JavaScript full-stack
- Large ecosystem (npm)
- Non-blocking I/O
- Great for APIs

### Why React?

- Component-based
- Virtual DOM performance
- Large community
- Rich ecosystem

### Why Prisma?

- Type-safe queries
- Auto-generated client
- Database migrations
- Modern DX

### Why PostgreSQL?

- ACID compliance
- Advanced features
- Scalability
- Open source

### Why Zustand?

- Lightweight
- Simple API
- No boilerplate
- TypeScript support

## Best Practices Implemented

- ✅ Separation of concerns
- ✅ DRY principle
- ✅ Error handling
- ✅ Input validation
- ✅ Security first
- ✅ Consistent naming
- ✅ Modular structure
- ✅ Documentation
- ✅ Version control
- ✅ Environment configs
