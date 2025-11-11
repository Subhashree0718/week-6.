# OKR Tracker Backend

AI-Powered OKR & Project Tracker Backend API

## Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- OpenAI API Integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database and API keys
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update profile

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams` - Get all teams
- `GET /api/teams/:teamId` - Get team details
- `PATCH /api/teams/:teamId` - Update team
- `DELETE /api/teams/:teamId` - Delete team
- `POST /api/teams/:teamId/members` - Add member
- `PATCH /api/teams/:teamId/members/:userId` - Update member role
- `DELETE /api/teams/:teamId/members/:userId` - Remove member

### Objectives
- `POST /api/objectives` - Create objective
- `GET /api/objectives` - Get all objectives
- `GET /api/objectives/:id` - Get objective details
- `PATCH /api/objectives/:id` - Update objective
- `DELETE /api/objectives/:id` - Delete objective

### Key Results
- `POST /api/objectives/:objectiveId/keyresults` - Create key result
- `GET /api/objectives/:objectiveId/keyresults` - Get key results
- `GET /api/keyresults/:id` - Get key result details
- `PATCH /api/keyresults/:id` - Update key result
- `DELETE /api/keyresults/:id` - Delete key result

### Updates
- `POST /api/updates` - Create update
- `GET /api/updates/objectives/:objectiveId` - Get updates
- `GET /api/updates/:id` - Get update details
- `PATCH /api/updates/:id` - Update an update
- `DELETE /api/updates/:id` - Delete update
- `GET /api/updates/objectives/:objectiveId/summary` - Generate AI summary

## Database Schema

See `prisma/schema.prisma` for complete schema definition.

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRES_IN` - Token expiration time
- `OPENAI_API_KEY` - OpenAI API key for summaries
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Docker

Build and run with Docker:
```bash
docker build -t okr-tracker-backend .
docker run -p 5000:5000 okr-tracker-backend
```
