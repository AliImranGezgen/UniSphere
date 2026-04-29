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

  // Sayfa yüklenme efekti (ürün hissi için simulate)
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '4rem', background: 'var(--bg-secondary)' }}>
      <style>{`
        .discovery-header {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
          padding: 3rem 0;
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .section-title span { color: var(--primary); }
        .grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .category-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid var(--border-color);
          transition: all 0.2s;
          cursor: pointer;
        }
        .category-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .club-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          transition: all 0.2s;
        }
        .club-card:hover { border-color: var(--primary-light); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .empty-state {
          padding: 3rem;
          text-align: center;
          background: white;
          border-radius: 12px;
          border: 1px dashed var(--border-color);
          color: var(--text-muted);
        }
        .announcement-bar {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e3a8a;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
      `}</style>

      {/* Üst Karşılama & Arama (Hero) */}
      <div className="discovery-header">
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Kampüste Neler Oluyor? 🌍
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '2rem' }}>
            En aktif öğrenci toplulukları, merak uyandıran etkinlikler ve kampüs içi en son duyurular burada.
          </p>
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px' }}>
            <input 
              type="text" 
              placeholder="Etkinlik veya topluluk ara..." 
              style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '8px', border: 'none', outline: 'none', fontSize: '1rem' }}
            />
            <button className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>Keşfet</button>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        {/* Sistem Duyuruları */}
        <section>
          <div className="section-title"><span>📢</span> Sistem Duyuruları</div>
          {announcements.length > 0 ? (
            <div>
              {announcements.map(ann => (
                <div key={ann.id} className="announcement-bar" style={ann.type === 'warning' ? { background: '#fffbeb', borderColor: '#fde68a', color: '#92400e' } : {}}>
                  <div style={{ flex: 1, fontWeight: 600 }}>{ann.message}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{new Date(ann.createdAt).toLocaleDateString('tr-TR')}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Şu an için yeni bir duyuru bulunmuyor.</div>
          )}
        </section>

        {/* Kategoriler */}
        <section>
          <div className="section-title"><span>📂</span> Kategorileri Keşfet</div>
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {categories.map(cat => (
              <div key={cat.key} className="category-card">
                <div style={{ fontSize: '2rem' }}>#</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.label}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{eventCountByCategory[cat.key] ?? 0} Etkinlik</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popüler Etkinlikler */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title"><span>🔥</span> Popüler Etkinlikler</div>
            <Link to="/events" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Tümünü Gör</Link>
          </div>
          
          <div className="grid-cards">
            {popularEvents.map(event => (
              <div key={event.eventId} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Görsel</div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                   <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{event.clubName}</div>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.4 }}>{event.title}</h3>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(event.eventDate).toLocaleDateString('tr-TR')}</span>
                      <Link to={`/student/events/${event.eventId}`} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Detaylar</Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Öne Çıkan Topluluklar */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title"><span>🌟</span> Öne Çıkan Topluluklar</div>
            <Link to="/clubs" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Tüm Topluluklar</Link>
          </div>
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {featuredClubs.map(club => (
              <div key={club.id} className="club-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#94a3b8' }}>
                  {club.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{club.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{club.memberCount} Üye</div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{club.description}</p>
                </div>
                <div>
                  <Link to={`/clubs/${club.id}`} className="btn" style={{ padding: '0.5rem', background: '#eff6ff', color: 'var(--primary)' }}>&rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
