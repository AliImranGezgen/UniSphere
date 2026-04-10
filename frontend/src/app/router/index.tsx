import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import AuthLayout from '../../layouts/AuthLayout';
import StudentLayout from '../../layouts/StudentLayout';
import ClubAdminLayout from '../../layouts/ClubAdminLayout';
import SystemAdminLayout from '../../layouts/SystemAdminLayout';

import HomePage from '../../pages/public/HomePage';
import LoginPage from '../../pages/public/LoginPage';
import RegisterPage from '../../pages/public/RegisterPage';
import UnauthorizedPage from '../../pages/public/UnauthorizedPage';
import NotFoundPage from '../../pages/public/NotFoundPage';

import StudentDashboard from '../../pages/student/DashboardPage';
import EventsPage from '../../pages/student/EventsPage';

import ClubAdminDashboard from '../../pages/clubAdmin/DashboardPage';
import SystemAdminDashboard from '../../pages/systemAdmin/DashboardPage';

export const router = createBrowserRouter([
  { path: '/', element: <MainLayout />, children: [{ index: true, element: <HomePage /> }, { path: 'unauthorized', element: <UnauthorizedPage /> }, { path: '*', element: <NotFoundPage /> }] },
  { path: '/', element: <AuthLayout />, children: [{ path: 'login', element: <LoginPage /> }, { path: 'register', element: <RegisterPage /> }] },
  { path: '/student', element: <StudentLayout />, children: [{ path: 'dashboard', element: <StudentDashboard /> }, { path: 'events', element: <EventsPage /> }] },
  { path: '/club-admin', element: <ClubAdminLayout />, children: [{ path: 'dashboard', element: <ClubAdminDashboard /> }] },
  { path: '/system-admin', element: <SystemAdminLayout />, children: [{ path: 'dashboard', element: <SystemAdminDashboard /> }] }
]);
