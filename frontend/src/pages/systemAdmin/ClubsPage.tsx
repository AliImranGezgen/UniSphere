import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClubs } from '../../services/clubService';
import type { Club } from '../../types/club';

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getClubs()
      .then(setClubs)
      .catch(() => setError('Topluluk listesi yüklenemedi.'));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Topluluklar</div>
          <h1 className="panel-title">Topluluk yönetimi</h1>
          <p className="panel-subtitle">Platformdaki toplulukları inceleyin, başkan atayın ve ekip yetkilerini yönetin.</p>
          <div className="panel-actions">
            <button className="btn btn-primary" onClick={() => navigate('/system-admin/clubs/create')}>
              + Yeni topluluk oluştur
            </button>
          </div>
        </section>

        {error ? <div className="notice notice-error" style={{ marginBottom: '1rem' }}>{error}</div> : null}

        <div className="panel-grid">
          {clubs.map((club) => (
            <article className="panel-card" key={club.id}>
              <div className="panel-card__top">
                <h2 className="panel-card__title">{club.name}</h2>
                <span className="chip">#{club.id}</span>
              </div>
              <p className="panel-card__text">{club.shortDescription || club.description}</p>
              <span className="status-pill">Oluşturuldu: {new Date(club.createdAt).toLocaleDateString('tr-TR')}</span>
              <div className="panel-card__actions">
                <button className="btn btn-sm" onClick={() => navigate(`/system-admin/clubs/${club.id}/assign-president`)}>
                  Başkan ata
                </button>
                <button className="btn btn-sm" onClick={() => navigate(`/system-admin/clubs/${club.id}/team`)}>
                  Ekip yönet
                </button>
              </div>
            </article>
          ))}

          {clubs.length === 0 && !error ? (
            <article className="panel-card">
              <h2 className="panel-card__title">Henüz topluluk yok</h2>
              <p className="panel-card__text">Yeni topluluk oluşturarak yönetim akışını başlatabilirsiniz.</p>
            </article>
          ) : null}
        </div>
      </div>
    </div>
  );
}
