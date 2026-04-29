// UniSphere notu: Dashboard Page ogrenci deneyimindeki ana ekranlardan biridir.
import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Link } from 'react-router-dom';
import { aiService } from '../../services/aiService';
import { getEvents } from '../../services/eventService';
import { getFillCount } from '../pageData';

// Örnek Dummy Veri (Backend modelimizi yansıtacak şekilde)
const mockRecommendations = [
  {
    eventId: 101,
    title: "AI ve Gelecek Zirvesi",
    clubName: "Teknoloji ve İnovasyon Kulübü",
    date: "2026-05-10T14:00:00Z",
    location: "Ana Konferans Salonu",
    score: 0.95,
    reason: "En çok ilgi duyduğunuz kategori (Yapay Zeka).",
    capacity: 150,
    filled: 120
  },
  {
    eventId: 102,
    title: "Kariyer Gelişimi ve Mülakat Teknikleri",
    clubName: "Kariyer Kulübü",
    date: "2026-04-20T10:00:00Z",
    location: "Seminer Salonu B",
    score: 0.82,
    reason: "Etkinliklerine düzenli katıldığınız bir kulüp.",
    capacity: 80,
    filled: 75
  },
  {
    eventId: 103,
    title: "Bahar Şenliği Organizasyon Toplantısı",
    clubName: "Müzik ve Sanat Kulübü",
    date: "2026-04-25T16:00:00Z",
    location: "Kültür Merkezi",
    score: 0.76,
    reason: "Profilinizdeki ilgi alanlarıyla eşleşiyor.",
    capacity: 50,
    filled: 15
  }
];

type DashboardRecommendation = typeof mockRecommendations[number];

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<DashboardRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), aiService.getRecommendations()])
      .then(([events, aiRecommendations]) => {
        const mapped = aiRecommendations
          .map((recommendation) => {
            const event = events.find((item) => item.eventId === recommendation.eventId);
            if (!event) return null;
            return {
              eventId: event.eventId,
              title: event.title,
              clubName: event.clubName,
              date: event.eventDate,
              location: event.location,
              score: recommendation.score,
              reason: recommendation.reason,
              capacity: event.capacity,
              filled: getFillCount(event),
            };
          })
          .filter((item): item is DashboardRecommendation => Boolean(item));
        setRecommendations(mapped);
      })
      .catch(() => setRecommendations([]))
      .finally(() => setLoadingRecommendations(false));
  }, []);

  // Normalde burada useEffect yapıp backend'in recommendation endpoint'i çağırılır:
  // getRecommendations().then(setRecommendations);

  return (
    <div className="std-dashboard">
      <style>{`
        .std-dashboard {
          min-height: 100vh;
          background: var(--bg-secondary, #f8fafc);
          padding-bottom: 4rem;
        }
        
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Hero Section */
        .dash-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 3rem;
          border-radius: 20px;
          margin-top: 2rem;
          margin-bottom: 3rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
        }

        .dash-hero::after {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2v-20h2v20h2v-20h2v20h2v-20h2v20h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h-22v-2h-2v2h-2v-2h-2v2h-2v-2h-2v2h-2v-2h-2v2h-2v-2h-2v2h-2v-2h-22v-20z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .dash-hero__content {
          position: relative;
          z-index: 1;
        }

        .dash-hero__title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .dash-hero__subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
        }

        /* Section Header */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title svg {
          color: #3b82f6;
        }

        /* Recommendations Grid */
        .rec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .rec-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .rec-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #bfdbfe;
        }

        /* Score Badge */
        .rec-score-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: #eff6ff;
          color: #2563eb;
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid #bfdbfe;
        }

        .rec-card__club {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          padding-right: 4rem; /* score alani icin */
        }

        .rec-card__title {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.3;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        /* Match Reason Block (Explainability) */
        .rec-reason {
          background: linear-gradient(to right, #f8fafc, #f1f5f9);
          border-left: 3px solid #3b82f6;
          padding: 0.75rem 1rem;
          border-radius: 0 8px 8px 0;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          color: #475569;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        
        .rec-reason svg {
          min-width: 16px;
          color: #3b82f6;
          margin-top: 2px;
        }

        .rec-card__meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 1.5rem;
          margin-top: auto;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.9rem;
        }

        /* Capacity bar */
        .capacity-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
          margin-top: 4px;
        }

        .capacity-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        .acc-actions {
          display: flex;
          gap: 10px;
          border-top: 1px solid #e2e8f0;
          padding-top: 1rem;
        }

        .btn-view {
          flex: 1;
          background: white;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.6rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .btn-apply {
          flex: 1;
          background: #3b82f6;
          border: none;
          color: white;
          padding: 0.6rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-apply:hover {
          background: #2563eb;
        }
      `}</style>
      
      <PageHeader title="Öğrenci Paneli" />

      <div className="dashboard-container">
        
        {/* Başlık Kartı */}
        <div className="dash-hero">
          <div className="dash-hero__content">
            <h1 className="dash-hero__title">Kampüs hayatına hoş geldin!</h1>
            <p className="dash-hero__subtitle">Senin için özel olarak hazırlanmış etkinlik önerilerine göz at.</p>
          </div>
        </div>

        {/* Sana Özel Etkinlikler Alanı (Recommendation Engine Output Ekranı) */}
        <div className="section-header">
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4M3 5h4"/>
            </svg>
            Sana Özel Etkinlikler
          </h2>
          <Link to="/student/recommended" style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Tümünü Gör &rarr;
          </Link>
        </div>

        <div className="rec-grid">
          {loadingRecommendations ? <div className="rec-card">AI önerileri yükleniyor...</div> : null}
          {!loadingRecommendations && recommendations.length === 0 ? (
            <div className="rec-card">
              <h3 className="rec-card__title">Henüz kişisel öneri yok</h3>
              <p className="rec-reason">Etkinliklere başvurdukça öneriler daha görünür hale gelecek.</p>
            </div>
          ) : null}
          {recommendations.map(rec => {
            // Kontenjan hesabı
            const percent = (rec.filled / rec.capacity) * 100;
            let bgColor = '#22c55e'; // default green
            if (percent > 90) bgColor = '#ef4444'; // red
            else if (percent > 70) bgColor = '#f59e0b'; // yellow

            return (
              <div key={rec.eventId} className="rec-card">
                
                {/* Score */}
                <div className="rec-score-badge" title="Yapay Zeka Uygunluk Skoru">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {Math.round(rec.score * 100)}% Eşleşme
                </div>

                <div className="rec-card__club">{rec.clubName}</div>
                <h3 className="rec-card__title">{rec.title}</h3>

                {/* Explainability / Neden Önerildi Bölümü */}
                <div className="rec-reason">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <div>
                    <strong style={{ color: '#334155' }}>Neden önerildi?</strong><br/>
                    {rec.reason}
                  </div>
                </div>

                <div className="rec-card__meta">
                  <div className="meta-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {new Date(rec.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="meta-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {rec.location}
                  </div>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                      <span>Kontenjan: {rec.filled} / {rec.capacity}</span>
                      <span>%{Math.round(percent)} Dolu</span>
                    </div>
                    <div className="capacity-bar">
                      <div className="capacity-fill" style={{ width: `${percent}%`, backgroundColor: bgColor }}></div>
                    </div>
                  </div>
                </div>

                <div className="acc-actions">
                  <Link className="btn-view" to={`/student/events/${rec.eventId}`} style={{ textAlign: 'center', textDecoration: 'none' }}>Detaylar</Link>
                  <Link className="btn-apply" to={`/student/events/${rec.eventId}`} style={{ textAlign: 'center', textDecoration: 'none' }}>Hemen Başvur</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
