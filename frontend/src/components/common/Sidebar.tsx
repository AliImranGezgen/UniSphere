// UniSphere notu: Sidebar birden fazla sayfada tekrar eden arayuz ihtiyacini karsilar.
import { NavLink, useLocation } from 'react-router-dom';

type MenuItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
};

const icon = (path: React.ReactNode) => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    {path}
  </svg>
);

export default function Sidebar() {
  const location = useLocation();

  const dashboardIcon = icon(<><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>);
  const calendarIcon = icon(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>);
  const usersIcon = icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></>);
  const profileIcon = icon(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
  const scanIcon = icon(<><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 8h10M7 12h10M7 16h6" /></>);
  const menuItems: MenuItem[] = location.pathname.startsWith('/club-admin')
    ? [
        { title: 'Kulüp Paneli', path: '/club-admin/dashboard', icon: dashboardIcon },
        { title: 'Etkinliklerim', path: '/club-admin/events', icon: calendarIcon },
        { title: 'Yeni Etkinlik', path: '/club-admin/events/create', icon: icon(<path d="M12 5v14M5 12h14" />) },
        { title: 'Katılımcılar', path: '/club-admin/participants', icon: usersIcon },
        { title: 'QR Check-in', path: '/club-admin/qr-scanner', icon: scanIcon },
        { title: 'No-show Riski', path: '/club-admin/no-show-risk', icon: icon(<path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />) },
        { title: 'Analitik', path: '/club-admin/analytics', icon: icon(<><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>) },
      ]
    : location.pathname.startsWith('/system-admin')
      ? [
          { title: 'Sistem Paneli', path: '/system-admin/dashboard', icon: dashboardIcon },
          { title: 'Kulüpler', path: '/system-admin/clubs', icon: usersIcon },
          { title: 'Kullanıcılar', path: '/system-admin/users', icon: profileIcon },
          { title: 'Moderasyon', path: '/system-admin/moderation', icon: icon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>) },
        ]
      : [
          { title: 'Öğrenci Paneli', path: '/student/dashboard', icon: dashboardIcon },
          { title: 'Tüm Etkinlikler', path: '/student/events', icon: calendarIcon },
          { title: 'Önerilenler', path: '/student/recommended', icon: icon(<path d="m12 3 1.9 5.8L20 12l-6.1 3.2L12 21l-1.9-5.8L4 12l6.1-3.2L12 3z" />) },
          { title: 'Başvurularım', path: '/student/applications', icon: icon(<path d="M9 11l3 3L22 4" />) },
          { title: 'Geçmiş', path: '/student/history', icon: icon(<><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 3v6h6" /></>) },
          { title: 'Bildirimler', path: '/student/notifications', icon: icon(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>) },
          { title: 'Profilim', path: '/student/profile', icon: profileIcon },
        ];

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          box-shadow: 2px 0 10px rgba(0,0,0,0.02);
          position: sticky;
          top: 60px; /* navbar kismindan asagida kalmali */
          height: calc(100vh - 60px);
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #475569;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        @media (max-width: 900px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: static;
            border-right: 0;
            border-bottom: 1px solid #e2e8f0;
          }

          .sidebar-menu {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }

        .sidebar-link:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .sidebar-link.active {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 600;
        }

        .sidebar-link svg {
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .sidebar-link.active svg {
          opacity: 1;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
          color: #94a3b8;
          font-size: 0.8rem;
          text-align: center;
        }
      `}</style>

      <aside className="sidebar">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-footer">
          <p>© 2026 UniSphere</p>
        </div>
      </aside>
    </>
  );
}
