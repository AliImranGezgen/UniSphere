// UniSphere notu: Dashboard Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';
import type { Event } from '../../types/event';
import { fallbackEvents, formatDateTime, getFillCount, getFillPercent } from '../pageData';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents);

  useEffect(() => {
    getEvents().then(setEvents).catch(() => setEvents(fallbackEvents));
  }, []);

  const upcoming = [...events].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()).slice(0, 3);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">Kulüp Yönetimi</div>
            <h1 className="panel-title">Etkinlik operasyon paneli</h1>
            <p className="panel-subtitle">Etkinlik oluştur, katılımcıları izle, QR check-in akışını yönet ve no-show riskini takip et.</p>
            <div className="panel-actions">
              <Link className="btn btn-primary" to="/club-admin/events/create">Yeni Etkinlik</Link>
              <Link className="btn btn-outline" to="/club-admin/participants">Katılımcılar</Link>
            </div>
          </div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-value">{events.length}</div><div className="metric-label">Etkinlik</div></div>
            <div className="metric-card"><div className="metric-value">{events.reduce((sum, event) => sum + getFillCount(event), 0)}</div><div className="metric-label">Başvuru</div></div>
            <div className="metric-card"><div className="metric-value">{Math.round(events.reduce((sum, event) => sum + getFillPercent(event), 0) / Math.max(events.length, 1))}%</div><div className="metric-label">Ort. doluluk</div></div>
            <div className="metric-card"><div className="metric-value">12</div><div className="metric-label">Check-in</div></div>
          </div>
        </section>
        <div className="panel-grid">
          {upcoming.map((event) => (
            <article className="panel-card" key={event.eventId}>
              <div className="panel-card__top">
                <h2 className="panel-card__title">{event.title}</h2>
                <span className="status-pill">{getFillPercent(event)}%</span>
              </div>
              <p className="panel-muted">{formatDateTime(event.eventDate)} · {event.location}</p>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${getFillPercent(event)}%` }} /></div>
              <Link className="btn btn-outline" to={`/club-admin/events/${event.eventId}/edit`}>Düzenle</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
