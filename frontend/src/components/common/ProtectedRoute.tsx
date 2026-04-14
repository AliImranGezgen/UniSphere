// UniSphere notu: Protected Route birden fazla sayfada tekrar eden arayuz ihtiyacini karsilar.

import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const hasAccess = true;
  if (!hasAccess || !allowedRoles) return <Navigate to="/unauthorized" />;
  return <>{children}</>;
}
