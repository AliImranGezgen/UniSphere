import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    {
      title: "Öğrenci Paneli",
      path: "/student/dashboard",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="9" rx="1" ry="1"/>
          <rect x="14" y="3" width="7" height="5" rx="1" ry="1"/>
          <rect x="14" y="12" width="7" height="9" rx="1" ry="1"/>
          <rect x="3" y="16" width="7" height="5" rx="1" ry="1"/>
        </svg>
      )
    },
    {
      title: "Tüm Etkinlikler",
      path: "/student/events",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    {
      title: "Kulüpler",
      path: "/clubs",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      )
    },
    {
      title: "Profilim",
      path: "/student/profile",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
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
