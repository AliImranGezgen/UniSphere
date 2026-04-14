
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

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
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Giriş Yap</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Kayıt Ol</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
