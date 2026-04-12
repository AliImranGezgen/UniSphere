
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      
      {/* Footer Placeholder for visual hierarchy */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 0', backgroundColor: '#fff' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} UniSphere. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
