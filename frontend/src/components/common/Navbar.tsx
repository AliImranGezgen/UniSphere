// UniSphere notu: Navbar birden fazla sayfada tekrar eden arayuz ihtiyacini karsilar.

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      authService.getProfile()
        .then(profile => setUserRole(profile.role))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navLinkStyle = (path: string) => ({
    color: location.pathname === path ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: 500,
    fontSize: '0.95rem',
    textDecoration: 'none',
    transition: 'color 0.2s',
  });

  return (
    <header style={{ 
      width: '100%', 
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      borderBottom: '1px solid var(--border-color)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50,
      backdropFilter: 'blur(8px)'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '4rem' 
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
  <img 
    src="/UniSphereLogoSiyah.png" 
    alt="UniSphere Logo"
    style={{ height: '200px', width: 'auto' }}
  />
</Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={navLinkStyle('/')} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = location.pathname === '/' ? 'var(--primary)' : 'var(--text-muted)'}>Ana Sayfa</Link>
          <Link to="/events" style={navLinkStyle('/events')} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = location.pathname === '/events' ? 'var(--primary)' : 'var(--text-muted)'}>Etkinlikler</Link>
          <Link to="/clubs" style={navLinkStyle('/clubs')} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = location.pathname === '/clubs' ? 'var(--primary)' : 'var(--text-muted)'}>Kulüpler</Link>
          <Link to="/demo" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderColor: location.pathname === '/demo' ? 'var(--primary)' : 'var(--border-color)', color: location.pathname === '/demo' ? 'var(--primary)' : 'var(--text-main)' }}>Sunum</Link>
          
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
            {isAuthenticated ? (
              <>
                {(userRole === 'SystemAdmin' || userRole === 'system_admin' || userRole === 'systemadmin') ? (
                  <Link to="/system-admin/dashboard" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Admin Paneli</Link>
                ) : (
                  <Link to="/student/dashboard" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Öğrenci Paneli</Link>
                )}
                {(userRole === 'ClubAdmin' || userRole === 'club_admin' || userRole === 'clubadmin') && (
                  <Link to="/club-admin/dashboard" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Kulüp Yönetimi</Link>
                )}
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', color: '#E63946', borderColor: '#E63946' }}>Çıkış Yap</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Giriş Yap</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Kayıt Ol</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
