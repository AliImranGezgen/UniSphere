// UniSphere notu: İndex uygulama rotalarini ve yetkili gecisleri bir araya getirir.
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
import EventsDiscoverPage from '../../pages/public/EventsDiscoverPage';
import ClubsDiscoverPage from '../../pages/public/ClubsDiscoverPage';
import ClubDetailPage from '../../pages/public/ClubDetailPage';
import DemoNavigationPage from '../../pages/public/DemoNavigationPage';

import StudentDashboard from '../../pages/student/DashboardPage';
import EventsPage from '../../pages/student/EventsPage';
import EventDetailPage from '../../pages/student/EventDetailPage';
import EventHistoryPage from '../../pages/student/EventHistoryPage';
import MyApplicationsPage from '../../pages/student/MyApplicationsPage';
import NotificationsPage from '../../pages/student/NotificationsPage';
import ProfilePage from '../../pages/student/ProfilePage';
import RecommendedEventsPage from '../../pages/student/RecommendedEventsPage';
import ReviewPage from '../../pages/student/ReviewPage';
import TicketQrPage from '../../pages/student/TicketQrPage';

import ClubAdminDashboard from '../../pages/clubAdmin/DashboardPage';
import CreateEventPage from '../../pages/clubAdmin/CreateEventPage';
import EditEventPage from '../../pages/clubAdmin/EditEventPage';
import EventAnalyticsPage from '../../pages/clubAdmin/EventAnalyticsPage';
import MyEventsPage from '../../pages/clubAdmin/MyEventsPage';
import NoShowRiskPage from '../../pages/clubAdmin/NoShowRiskPage';
import ParticipantsPage from '../../pages/clubAdmin/ParticipantsPage';
import QrScannerPage from '../../pages/clubAdmin/QrScannerPage';

import SystemAdminDashboard from '../../pages/systemAdmin/DashboardPage';
import SystemAdminClubsPage from '../../pages/systemAdmin/ClubsPage';
import ModerationPage from '../../pages/systemAdmin/ModerationPage';
import UsersPage from '../../pages/systemAdmin/UsersPage';

export const router = createBrowserRouter([
  { path: '/', element: <MainLayout />, children: [{ index: true, element: <HomePage /> }, { path: 'demo', element: <DemoNavigationPage /> }, { path: 'events', element: <EventsDiscoverPage /> }, { path: 'clubs', element: <ClubsDiscoverPage /> }, { path: 'clubs/:id', element: <ClubDetailPage /> }, { path: 'unauthorized', element: <UnauthorizedPage /> }, { path: '*', element: <NotFoundPage /> }] },
  { path: '/', element: <AuthLayout />, children: [{ path: 'login', element: <LoginPage /> }, { path: 'register', element: <RegisterPage /> }] },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:eventId', element: <EventDetailPage /> },
      { path: 'applications', element: <MyApplicationsPage /> },
      { path: 'history', element: <EventHistoryPage /> },
      { path: 'recommended', element: <RecommendedEventsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'ticket/:eventId', element: <TicketQrPage /> },
      { path: 'review/:eventId', element: <ReviewPage /> },
    ],
  },
  {
    path: '/club-admin',
    element: <ClubAdminLayout />,
    children: [
      { index: true, element: <ClubAdminDashboard /> },
      { path: 'dashboard', element: <ClubAdminDashboard /> },
      { path: 'events', element: <MyEventsPage /> },
      { path: 'events/create', element: <CreateEventPage /> },
      { path: 'events/:eventId/edit', element: <EditEventPage /> },
      { path: 'analytics', element: <EventAnalyticsPage /> },
      { path: 'participants', element: <ParticipantsPage /> },
      { path: 'qr-scanner', element: <QrScannerPage /> },
      { path: 'no-show-risk', element: <NoShowRiskPage /> },
    ],
  },
  {
    path: '/system-admin',
    element: <SystemAdminLayout />,
    children: [
      { index: true, element: <SystemAdminDashboard /> },
      { path: 'dashboard', element: <SystemAdminDashboard /> },
      { path: 'clubs', element: <SystemAdminClubsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'moderation', element: <ModerationPage /> },
    ],
  }
]);
