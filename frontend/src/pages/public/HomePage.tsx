// UniSphere Notu: Bu sayfa sistemi bir landing page'den çıkarıp "Keşif Ekranı" haline getirmek için güncellenmiştir.
// Öğrencilerin siteye girdiklerinde aktif kampüs hayatını görebilecekleri ana vitrindir.
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { discoveryService, type DiscoveryAnnouncement, type DiscoveryCategory } from '../../services/discoveryService';
import type { Club } from '../../types/club';
import type { Event } from '../../types/event';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<DiscoveryAnnouncement[]>([]);
  const [categories, setCategories] = useState<DiscoveryCategory[]>([]);
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [featuredClubs, setFeaturedClubs] = useState<Club[]>([]);

  useEffect(() => {
    Promise.all([
      discoveryService.getAnnouncements(),
      discoveryService.getCategories(),
      discoveryService.getPopularEvents(),
      discoveryService.getPopularClubs(),
    ])
      .then(([announcementData, categoryData, eventData, clubData]) => {
        setAnnouncements(announcementData);
        setCategories(categoryData);
        setPopularEvents(eventData);
        setFeaturedClubs(clubData);
      })
      .catch(() => {
        // Hata durumunda sessizce fail olabilir, veya ui'da gösterilebilir
      })
      .finally(() => setLoading(false));
  }, []);

  const eventCountByCategory = popularEvents.reduce<Record<string, number>>((acc, event) => {
    const key = event.category || 'other';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Keşif ekranı yükleniyor...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* ── Layout ── */
        .ev-page { min-height: 100vh; background: var(--bg-secondary); }

        /* ── Hero Banner ── */
        .ev-hero {
          background: var(--gradient-hero);
          padding: 4rem 0 5rem;
          position: relative;
          overflow: hidden;
        }
        .ev-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        }
        .ev-hero__content { position: relative; text-align: center; }
        .ev-hero__eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          color: white; padding: 6px 16px; border-radius: 999px;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .ev-hero__title {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800; color: white;
          line-height: 1.15; margin-bottom: 1rem;
        }
        .ev-hero__subtitle {
          color: rgba(255,255,255,0.8);
          font-size: 1.1rem; max-width: 600px;
          margin: 0 auto 2.5rem;
        }

        /* ── Search bar ── */
        .ev-search-wrap {
          max-width: 560px; margin: 0 auto;
          background: white; border-radius: 14px;
          display: flex; align-items: center; gap: 0;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .ev-search-icon {
          padding: 0 16px; color: #94a3b8;
          display: flex; align-items: center;
        }
        .ev-search-input {
          flex: 1; border: none; outline: none;
          font-size: 1rem; font-family: inherit;
          padding: 14px 0; color: var(--text-main);
          background: transparent;
        }
        .ev-search-input::placeholder { color: #94a3b8; }
        .ev-search-btn {
          margin: 6px; padding: 10px 20px;
          background: var(--primary); color: white;
          border-radius: 10px; font-size: 0.9rem;
          font-weight: 600; font-family: inherit;
          border: none; cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .ev-search-btn:hover { background: var(--primary-hover); }

        /* ── Body ── */
        .ev-body { padding: 3rem 0 5rem; }

        /* ── Section Title ── */
        .ev-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 1.5rem; font-weight: 700; color: var(--text-main);
          margin-bottom: 1.5rem; margin-top: 3rem;
        }
        .ev-section-title:first-child { margin-top: 0; }
        
        .ev-header-row {
          display: flex; justify-content: space-between; align-items: center;
        }

        /* ── Grid ── */
        .ev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 1.5rem;
        }

        /* ── Card ── */
        .ev-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex; flex-direction: column; gap: 0;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .ev-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(79, 70, 229, 0.1);
          border-color: var(--primary-light);
        }

        .ev-card__club-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
          padding: 4px 10px; border-radius: 6px;
          width: fit-content; margin-bottom: 0.9rem;
          background-color: var(--primary-light);
          color: var(--primary);
          border: 1px solid var(--border-color);
        }

        .ev-card__title {
          font-size: 1.15rem; font-weight: 700;
          color: var(--text-main); line-height: 1.4;
          margin-bottom: 0.6rem;
        }
        .ev-card__desc {
          font-size: 0.9rem; color: var(--text-muted);
          line-height: 1.6; margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ev-card__meta {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin-bottom: 1.25rem;
        }
        .ev-card__meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.8rem; color: var(--text-muted);
          background: var(--bg-secondary);
          padding: 4px 10px; border-radius: 6px;
        }

        .ev-card__footer {
          display: flex; gap: 8px; margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .ev-card__btn { flex: 1; font-size: 0.875rem; padding: 0.55rem 1rem; }
        .ev-card__btn--detail {
          font-size: 0.875rem; padding: 0.55rem 1rem;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-main);
          border-radius: 0.5rem;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ev-card__btn--detail:hover { background: var(--bg-tertiary); }

        /* ── Announcements ── */
        .announcement-bar {
          background: var(--primary-light);
          border: 1px solid var(--border-color);
          color: var(--primary);
          padding: 1rem 1.2rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        /* ── Categories ── */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .category-card {
          background: white; border-radius: 16px; padding: 1.5rem;
          display: flex; align-items: center; gap: 1rem;
          border: 1px solid var(--border-color);
          transition: all 0.2s; cursor: pointer;
        }
        .category-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.08);
        }

        /* ── Empty State ── */
        .empty-state {
          padding: 3rem; text-align: center; background: white;
          border-radius: 16px; border: 1px dashed var(--border-color);
          color: var(--text-muted);
        }
      `}</style>

      <div className="ev-page">
        {/* ── Hero ── */}
        <div className="ev-hero">
          <div className="container ev-hero__content">
            <div className="ev-hero__eyebrow">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              Kampüste Neler Oluyor?
            </div>
            
            <h1 className="ev-hero__title">
              En aktif topluluklar,<br />merak uyandıran etkinlikler
            </h1>
            <p className="ev-hero__subtitle">
              Üniversitenin kalbi burada atıyor. Sınırsız etkinlikleri incele, yeni topluluklarla tanış ve kampüs hayatına hemen katıl.
            </p>

            <div className="ev-search-wrap">
              <span className="ev-search-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                className="ev-search-input"
                type="text"
                placeholder="Etkinlik veya topluluk ara..."
              />
              <Link to="/events" className="ev-search-btn" style={{textDecoration: 'none'}}>Keşfet</Link>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ev-body">
          <div className="container">
            
            {/* Sistem Duyuruları */}
            <div className="ev-section-title">📢 Sistem Duyuruları</div>
            {announcements.length > 0 ? (
              <div>
                {announcements.map((ann) => (
                  <div key={ann.id} className="announcement-bar" style={ann.type === 'warning' ? { background: '#fffbeb', borderColor: '#fde68a', color: '#92400e' } : {}}>
                    <div style={{ flex: 1, fontWeight: 600 }}>{ann.message}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{new Date(ann.createdAt).toLocaleDateString('tr-TR')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Şu an için yeni bir duyuru bulunmuyor.</div>
            )}

            {/* Kategoriler */}
            <div className="ev-section-title">📂 Kategorileri Keşfet</div>
            <div className="category-grid">
              {categories.map((cat) => (
                <div key={cat.key} className="category-card">
                  <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 'bold' }}>#</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.label}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{eventCountByCategory[cat.key] ?? 0} Etkinlik</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Popüler Etkinlikler */}
            <div className="ev-header-row">
              <div className="ev-section-title">🔥 Popüler Etkinlikler</div>
              <Link to="/events" className="btn btn-outline btn-sm">Tümünü Gör</Link>
            </div>
            
            {popularEvents.length > 0 ? (
              <div className="ev-grid">
                {popularEvents.map((event) => (
                  <div key={event.eventId} className="ev-card">
                    <div className="ev-card__club-badge">
                      {event.clubName || 'Etkinlik'}
                    </div>
                    <h3 className="ev-card__title">{event.title}</h3>
                    <p className="ev-card__desc">{event.description}</p>
                    
                    <div className="ev-card__meta">
                      <span className="ev-card__meta-item">📅 {new Date(event.eventDate).toLocaleDateString('tr-TR')}</span>
                      <span className="ev-card__meta-item">📍 {event.location}</span>
                    </div>
                    
                    <div className="ev-card__footer">
                      <Link to={`/student/events/${event.eventId}`} className="btn btn-primary ev-card__btn">Detaylar</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Şu an için popüler bir etkinlik bulunmuyor.</div>
            )}

            {/* Öne Çıkan Topluluklar */}
            <div className="ev-header-row">
              <div className="ev-section-title">🌟 Öne Çıkan Topluluklar</div>
              <Link to="/clubs" className="btn btn-outline btn-sm">Tüm Topluluklar</Link>
            </div>
            
            {featuredClubs.length > 0 ? (
              <div className="ev-grid">
                {featuredClubs.map((club) => (
                  <div key={club.id} className="ev-card">
                    <div className="ev-card__club-badge" style={{ fontSize: '1.2rem', padding: '10px 14px', borderRadius: '12px' }}>
                      {club.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="ev-card__title" style={{ marginTop: '0.5rem' }}>{club.name}</h3>
                    <p className="ev-card__desc">{club.description}</p>
                    
                    <div className="ev-card__meta">
                      <span className="ev-card__meta-item">👥 {club.memberCount} Üye</span>
                    </div>
                    
                    <div className="ev-card__footer">
                      <Link to={`/clubs/${club.id}`} className="btn btn-outline ev-card__btn">Kulübü İncele</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Şu an için öne çıkan bir topluluk bulunmuyor.</div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
