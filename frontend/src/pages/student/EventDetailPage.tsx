// UniSphere notu: Event Detail Page ogrenci deneyimindeki ana ekranlardan biridir.
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import type { Event } from '../../types/event';
import { fallbackEvents, formatDateTime, getFillCount, getFillPercent } from '../pageData';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const numericId = Number(eventId);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!numericId) return;
    getEventById(numericId)
      .then(setEvent)
      .catch(() => setEvent(fallbackEvents.find((item) => item.eventId === numericId) ?? fallbackEvents[0]));
  }, [numericId]);

  if (!event) {
    return <div className="panel-page"><div className="panel-shell"><div className="notice">Etkinlik detayı yükleniyor...</div></div></div>;
  }

  const fill = getFillCount(event);
  const percent = getFillPercent(event);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">{event.clubName || `Kulüp #${event.clubId}`}</div>
            <h1 className="panel-title">{event.title}</h1>
            <p className="panel-subtitle">{event.description}</p>
            <div className="panel-actions">
              <Link className="btn btn-primary" to="/student/applications">Başvur</Link>
              <Link className="btn btn-outline" to={`/student/ticket/${event.eventId}`}>QR Bilet</Link>
              <Link className="btn btn-outline" to={`/student/review/${event.eventId}`}>Yorum Yap</Link>
            </div>
          </div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-value">{formatDateTime(event.eventDate).split(' ')[0]}</div><div className="metric-label">{formatDateTime(event.eventDate)}</div></div>
            <div className="metric-card"><div className="metric-value">{event.capacity}</div><div className="metric-label">Kontenjan</div></div>
            <div className="metric-card"><div className="metric-value">{fill}</div><div className="metric-label">Tahmini başvuru</div></div>
            <div className="metric-card"><div className="metric-value">{percent}%</div><div className="metric-label">Doluluk</div></div>
          </div>
        </section>
        <div className="panel-card">
          <h2 className="panel-card__title">Etkinlik Bilgileri</h2>
          <div className="panel-meta">
            <span className="chip">{event.location}</span>
            <span className="chip">Etkinlik #{event.eventId}</span>
            <span className="chip">Kulüp #{event.clubId}</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
          <p className="panel-muted">Başvurular backend başvuru endpoint’i bağlandığında bu ekrandan doğrudan yönetilecek şekilde hazırlandı.</p>
        </div>
      </div>
    </div>
  );
}
