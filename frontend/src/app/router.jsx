import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Landing } from '../pages/landing/Landing';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Objectives } from '../pages/objectives/Objectives';
import { ObjectiveDetail } from '../pages/objectives/ObjectiveDetail';
import { Teams } from '../pages/teams/Teams';
import { TeamDetail } from '../pages/teams/TeamDetail';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { AcceptInvite } from '../pages/AcceptInvite';  // ✅ fix import path
import { ProfileSettings } from '../pages/profile/ProfileSettings';
import { AddMemberForm } from '../pages/teams/AddMemberForm';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: 'accept-invite',
        element: <AcceptInvite />,
      },
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'objectives',
            element: <Objectives />,
          },
          {
            path: 'objectives/:id',
            element: <ObjectiveDetail />,
          },
          {
            path: 'teams',
            element: <Teams />,
          },
          {
            path: 'teams/:id',
            element: <TeamDetail />,
          },
          {
            path: 'teams/:id/add-member',  // ✅ added new route
            element: <AddMemberForm />,
          },
          {
            path: 'profile',
            element: <ProfileSettings />,
          },
          
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center h-screen text-2xl">
        404 - Page Not Found
      </div>
    ),
  },
]);
