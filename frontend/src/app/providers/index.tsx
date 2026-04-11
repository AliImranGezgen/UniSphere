
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';

export function AppProviders() {
  return <RouterProvider router={router} />;
}
