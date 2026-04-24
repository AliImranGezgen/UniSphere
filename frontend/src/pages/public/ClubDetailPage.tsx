// UniSphere Notu: Topluluk Vitrin Sayfası. Öğrenciler bir kulübe tıkladıklarında bu detay sayfasını görecekler.
// Yaklaşan ve Geçmiş etkinlikler ayrımı ürün bazlı UX hissini kuvvetlendirir.
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';

// Mock Kulüp Verisi
const mockClubData = {
  id: 1,
  name: "Teknoloji Kulübü",
  description: "Üniversitemizin en köklü ve aktif teknoloji topluluğudur. Yazılım, yapay zeka, siber güvenlik alanlarında yetkinlik kazandırmayı ve öğrencileri sektörle buluşturmayı amaçlar.",
  memberCount: 350,
  established: "2018",
  contact: "teknoloji@unisphere.edu",
  socials: { instagram: "@uniteknoloji", linkedin: "uniteknoloji" },
  upcomingEvents: [
    { id: 101, title: "Yapay Zeka Zirvesi", date: "2026-11-05T10:00:00Z", location: "Ana Salon" },
    { id: 105, title: "React Workshop", date: "2026-11-12T14:00:00Z", location: "Lab 3" },
  ],
  pastEvents: [
    { id: 98, title: "Siber Güvenlik 101", date: "2026-09-15T15:00:00Z", location: "Seminer Odası" },
    { id: 85, title: "Bilişim Sektöründe Kariyer", date: "2026-05-10T13:00:00Z", location: "Online" },
  ]
};

export default function ClubDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Sayfa yüklenme simülasyonu (UX hissi)
  useEffect(() => {
    window.scrollTo(0,0);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Topluluk vitrini yükleniyor...</p>
      </div>
    );
  }

  // Not: Aslında id'ye göre API'den data fetch edilecek, şimdilik mock datayı alıyoruz

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '4rem' }}>
      <PageHeader title="Topluluk Profili" />
      
      <div className="container" style={{ maxWidth: '1000px', marginTop: '2rem' }}>
        
        {/* Üst Profil Kartı */}
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          {/* Cover Image */}
          <div style={{ height: '150px', background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)' }}></div>
          
          <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Kulüp Logosu (Avatar) */}
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', background: 'white', 
              border: '4px solid white', marginTop: '-50px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '1rem'
            }}>
              {mockClubData.name.charAt(0)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{mockClubData.name}</h1>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>👥 {mockClubData.memberCount} Üye</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📅 Kurulum: {mockClubData.established}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📧 {mockClubData.contact}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline">Takip Et</button>
                <button className="btn btn-primary">Topluluğa Katıl</button>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Hakkımızda</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{mockClubData.description}</p>
            </div>
            
            {/* Sosyal Medya (İletişim) */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
               <span style={{ padding: '0.4rem 0.8rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem', color: '#64748b' }}>IG: {mockClubData.socials.instagram}</span>
               <span style={{ padding: '0.4rem 0.8rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem', color: '#64748b' }}>IN: {mockClubData.socials.linkedin}</span>
            </div>
          </div>
        </div>

        {/* Etkinlikler Vitrini (Tab Navigation) */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('upcoming')}
              style={{ 
                padding: '1rem 2rem', background: 'none', border: 'none', fontSize: '1.05rem', fontWeight: 600,
                color: activeTab === 'upcoming' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer',
                borderBottom: activeTab === 'upcoming' ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Yaklaşan Etkinlikler ({mockClubData.upcomingEvents.length})
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              style={{ 
                padding: '1rem 2rem', background: 'none', border: 'none', fontSize: '1.05rem', fontWeight: 600,
                color: activeTab === 'past' ? '#64748b' : 'var(--text-muted)', cursor: 'pointer',
                borderBottom: activeTab === 'past' ? '3px solid #64748b' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Geçmiş Etkinlikler ({mockClubData.pastEvents.length})
            </button>
          </div>

          <div>
             {/* İçerik Render */}
             {activeTab === 'upcoming' && (
                mockClubData.upcomingEvents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {mockClubData.upcomingEvents.map(event => (
                      <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' }}>{event.title}</h4>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                             <span>📅 {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                             <span>📍 {event.location}</span>
                          </div>
                        </div>
                        <Link to={`/events/${event.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>İncele</Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Mevcut planlanan bir etkinlik yok.</div>
                )
             )}

             {activeTab === 'past' && (
                mockClubData.pastEvents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.8 }}>
                    {mockClubData.pastEvents.map(event => (
                      <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>{event.title}</h4>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                             Gerçekleşti: {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <Link to={`/events/${event.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', borderColor: '#cbd5e1', color: '#64748b' }}>Detayları Gör</Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Geçmiş etkinlik bulunamadı.</div>
                )
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
