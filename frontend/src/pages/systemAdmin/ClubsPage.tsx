import { useEffect, useState } from 'react';
import { getClubs } from '../../services/clubService';
import type { Club } from '../../types/club';

const fallbackClubs: Club[] = [
  { id: 1, name: 'Teknoloji Kulübü', description: 'Yazılım, yapay zeka ve ürün geliştirme etkinlikleri.', createdAt: '2026-01-10T10:00:00' },
  { id: 2, name: 'Kariyer Kulübü', description: 'Mülakat, CV ve sektör buluşmaları.', createdAt: '2026-02-02T10:00:00' },
  { id: 3, name: 'Müzik Kulübü', description: 'Konser, açık sahne ve atölyeler.', createdAt: '2026-02-20T10:00:00' },
];

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>(fallbackClubs);

  useEffect(() => {
    getClubs().then(setClubs).catch(() => setClubs(fallbackClubs));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Kulüpler</div>
          <h1 className="panel-title">Kulüp yönetimi</h1>
          <p className="panel-subtitle">Platformdaki kulüpleri incele, açıklama ve etkinlik sahipliği akışını takip et.</p>
        </section>
        <div className="panel-grid">
          {clubs.map((club) => (
            <article className="panel-card" key={club.id}>
              <div className="panel-card__top">
                <h2 className="panel-card__title">{club.name}</h2>
                <span className="chip">#{club.id}</span>
              </div>
              <p className="panel-card__text">{club.description}</p>
              <span className="status-pill">Oluşturuldu: {new Date(club.createdAt).toLocaleDateString('tr-TR')}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
