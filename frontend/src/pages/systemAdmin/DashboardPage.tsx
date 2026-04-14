// UniSphere notu: Dashboard Page sistem yoneticisi tarafindaki kontrol ekranini temsil eder.
import { useEffect, useState } from 'react';
import { getClubs } from '../../services/clubService';
import { getEvents } from '../../services/eventService';
import type { Club } from '../../types/club';
import type { Event } from '../../types/event';
import { fallbackEvents, mockUsers } from '../pageData';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents);
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    getEvents().then(setEvents).catch(() => setEvents(fallbackEvents));
    getClubs().then(setClubs).catch(() => setClubs([
      { id: 1, name: 'Teknoloji Kulübü', description: 'Yazılım ve AI etkinlikleri', createdAt: '2026-01-10T10:00:00' },
      { id: 2, name: 'Kariyer Kulübü', description: 'Kariyer hazırlık programları', createdAt: '2026-02-02T10:00:00' },
    ]));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">Sistem Yönetimi</div>
            <h1 className="panel-title">UniSphere kontrol merkezi</h1>
            <p className="panel-subtitle">Kulüp, kullanıcı, etkinlik ve moderasyon sağlığını tek panelden izle.</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-value">{clubs.length}</div><div className="metric-label">Kulüp</div></div>
            <div className="metric-card"><div className="metric-value">{events.length}</div><div className="metric-label">Etkinlik</div></div>
            <div className="metric-card"><div className="metric-value">{mockUsers.length}</div><div className="metric-label">Kullanıcı</div></div>
            <div className="metric-card"><div className="metric-value">2</div><div className="metric-label">Moderasyon işi</div></div>
          </div>
        </section>
        <div className="panel-grid">
          <article className="panel-card"><h2 className="panel-card__title">Platform durumu</h2><p className="panel-card__text">API, frontend ve veritabanı Docker mimarisi için ayrılmış bir monorepo içinde çalışıyor.</p><span className="status-pill status-pill--good">Aktif</span></article>
          <article className="panel-card"><h2 className="panel-card__title">Rol dağılımı</h2><p className="panel-card__text">Öğrenci, kulüp yöneticisi ve sistem yöneticisi deneyimleri ayrıştırıldı.</p><span className="status-pill">3 rol</span></article>
          <article className="panel-card"><h2 className="panel-card__title">AI modülleri</h2><p className="panel-card__text">Öneri ve no-show risk servisleri panel sayfalarına bağlandı.</p><span className="status-pill status-pill--warn">Kural tabanlı</span></article>
        </div>
      </div>
    </div>
  );
}
