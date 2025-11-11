# OKR Tracker Frontend

AI-Powered OKR & Project Tracker Frontend Application

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router v6
- Axios
- Lucide Icons

## Features

- JWT Authentication
- Dark/Light Theme
- Responsive Design
- Dashboard with Analytics
- OKR Management
- Team Management
- Real-time Progress Tracking
- AI-Powered Summaries

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── app/              # App configuration and routing
├── components/       # Reusable UI components
├── config/           # Environment configuration
├── constants/        # Constants and enums
├── features/         # Feature-specific modules
├── hooks/            # Custom React hooks
├── layouts/          # Layout components
├── pages/            # Page components
├── services/         # API services
├── store/            # Zustand stores
├── styles/           # Global styles
└── utils/            # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)
