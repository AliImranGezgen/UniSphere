// UniSphere Notu: Bu sayfa sistemi bir landing page'den çıkarıp "Keşif Ekranı" haline getirmek için güncellenmiştir.
// Öğrencilerin siteye girdiklerinde aktif kampüs hayatını görebilecekleri ana vitrindir.
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Dummy Veriler (Backend entegrasyonu aşamasında servislerden gelecek bilgiler)
const mockAnnouncements = [
  { id: 1, title: "Bahar Şenliği biletleri satışa çıktı!", date: "24 Eki 2026", type: "info" },
  { id: 2, title: "Teknoloji Kulübü yöneticilerini arıyor", date: "22 Eki 2026", type: "warning" },
];

const mockCategories = [
  { id: 1, name: "Teknoloji", icon: "💻", count: 12 },
  { id: 2, name: "Kariyer", icon: "🚀", count: 8 },
  { id: 3, name: "Sanat & Müzik", icon: "🎨", count: 15 },
  { id: 4, name: "Spor", icon: "⚽", count: 6 },
  { id: 5, name: "Bilim", icon: "🔬", count: 9 },
  { id: 6, name: "Sosyal Sorumluluk", icon: "🤝", count: 4 },
];

const mockEvents = [
  {
    id: 101,
    title: "Yapay Zeka ve Geleceğin Meslekleri",
    clubName: "Teknoloji Kulübü",
    date: "2026-10-28T14:00:00Z",
    location: "Ana Konferans Salonu",
    image: "tech-bg",
    isPopular: true
  },
  {
    id: 102,
    title: "Gitar Dersi - Yeni Başlayanlar İçin",
    clubName: "Müzik Kulübü",
    date: "2026-10-29T18:00:00Z",
    location: "Müzik Odası 2",
    image: "music-bg",
    isPopular: false
  },
  {
    id: 103,
    title: "Kariyer Günleri: Yazılım Sektörü",
    clubName: "Kariyer Kulübü",
    date: "2026-11-02T10:00:00Z",
    location: "Seminer Salonu A",
    image: "career-bg",
    isPopular: true
  }
];

const mockClubs = [
  { id: 1, name: "Teknoloji Kulübü", memberCount: 350, description: "Yazılım, donanım ve yapay zeka tutkunları.", isFeatured: true },
  { id: 2, name: "Doğa Sporları", memberCount: 220, description: "Kamp, doğa yürüyüşü ve tırmanış etkinlikleri.", isFeatured: true },
  { id: 3, name: "IEEE", memberCount: 400, description: "Mühendislik hayatına profesyonel bir adım.", isFeatured: true },
  { id: 4, name: "Tiyatro Topluluğu", memberCount: 150, description: "Sahne sanatlarına gönül verenler bir arada.", isFeatured: false },
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  // Sayfa yüklenme efekti (ürün hissi için simulate)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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
          {mockAnnouncements.length > 0 ? (
            <div>
              {mockAnnouncements.map(ann => (
                <div key={ann.id} className="announcement-bar" style={ann.type === 'warning' ? { background: '#fffbeb', borderColor: '#fde68a', color: '#92400e' } : {}}>
                  <div style={{ flex: 1, fontWeight: 600 }}>{ann.title}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{ann.date}</div>
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
            {mockCategories.map(cat => (
              <div key={cat.id} className="category-card">
                <div style={{ fontSize: '2rem' }}>{cat.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cat.count} Etkinlik</div>
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
            {mockEvents.filter(e => e.isPopular).map(event => (
              <div key={event.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Görsel</div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                   <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{event.clubName}</div>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.4 }}>{event.title}</h3>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
                      <Link to={`/events/${event.id}`} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Detaylar</Link>
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
            {mockClubs.filter(c => c.isFeatured).map(club => (
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
