import { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { authService } from '../../services/authService';
import { getClubById, joinClub } from '../../services/clubService';
import { getEvents } from '../../services/eventService';
import type { Club } from '../../types/club';
import type { Event } from '../../types/event';

export default function ClubDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clubId = Number(id);
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!clubId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([getClubById(clubId), getEvents()])
      .then(([clubData, eventData]) => {
        setClub(clubData);
        setEvents(eventData.filter((event) => event.clubId === clubId));
      })
      .finally(() => setLoading(false));
  }, [clubId]);

  const now = Date.now();
  const upcomingEvents = useMemo(
    () => events.filter((event) => new Date(event.eventDate).getTime() >= now),
    [events, now]
  );
  const pastEvents = useMemo(
    () => events.filter((event) => new Date(event.eventDate).getTime() < now),
    [events, now]
  );

  const handleJoin = () => {
    if (!club) return;
    if (!authService.isAuthenticated()) {
      setMessage('Topluluğa katılmak için önce giriş yapmalısınız.');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    joinClub(club.id)
      .then((result) => setMessage(result.message || 'Topluluğa katıldınız.'))
      .catch(() => setMessage('Topluluğa katılma işlemi tamamlanamadı.'));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Topluluk vitrini yükleniyor...</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Topluluk bulunamadı.
      </div>
    );
  }

  const visibleEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '4rem' }}>
      <PageHeader title="Topluluk Profili" />

      <div className="container" style={{ maxWidth: '1000px', marginTop: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div style={{ height: '150px', background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)' }}></div>

          <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%', background: 'white',
              border: '4px solid white', marginTop: '-50px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '1rem'
            }}>
              {club.logo ? <img src={club.logo} alt={club.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : club.name.charAt(0)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{club.name}</h1>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                  <span>{club.memberCount ?? 0} Üye</span>
                  {club.foundedYear ? <span>Kurulum: {club.foundedYear}</span> : null}
                  {club.contactEmail ? <span>{club.contactEmail}</span> : null}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" type="button">Takip Et</button>
                <button className="btn btn-primary" type="button" onClick={handleJoin}>Topluluğa Katıl</button>
              </div>
            </div>

            {message ? <div className="notice notice-success" style={{ marginTop: '1rem' }}>{message}</div> : null}

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Hakkımızda</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{club.aboutText || club.description}</p>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {club.website ? <span style={{ padding: '0.4rem 0.8rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem', color: '#64748b' }}>{club.website}</span> : null}
              {club.socialLinks ? <span style={{ padding: '0.4rem 0.8rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem', color: '#64748b' }}>{club.socialLinks}</span> : null}
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <button onClick={() => setActiveTab('upcoming')} style={{ padding: '1rem 2rem', background: 'none', border: 'none', fontSize: '1.05rem', fontWeight: 600, color: activeTab === 'upcoming' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: activeTab === 'upcoming' ? '3px solid var(--primary)' : '3px solid transparent', transition: 'all 0.2s' }}>
              Yaklaşan Etkinlikler ({upcomingEvents.length})
            </button>
            <button onClick={() => setActiveTab('past')} style={{ padding: '1rem 2rem', background: 'none', border: 'none', fontSize: '1.05rem', fontWeight: 600, color: activeTab === 'past' ? '#64748b' : 'var(--text-muted)', cursor: 'pointer', borderBottom: activeTab === 'past' ? '3px solid #64748b' : '3px solid transparent', transition: 'all 0.2s' }}>
              Geçmiş Etkinlikler ({pastEvents.length})
            </button>
          </div>

          {visibleEvents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: activeTab === 'past' ? 0.8 : 1 }}>
              {visibleEvents.map((event) => (
                <div key={event.eventId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: activeTab === 'past' ? '#f8fafc' : 'white' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' }}>{event.title}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                      <span>{new Date(event.eventDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Link to={`/student/events/${event.eventId}`} className={activeTab === 'past' ? 'btn btn-outline' : 'btn btn-primary'} style={{ padding: '0.5rem 1.5rem' }}>
                    {activeTab === 'past' ? 'Detayları Gör' : 'İncele'}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              {activeTab === 'past' ? 'Geçmiş etkinlik bulunamadı.' : 'Mevcut planlanan bir etkinlik yok.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
