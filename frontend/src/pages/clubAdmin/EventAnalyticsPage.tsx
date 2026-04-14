import { useEffect, useState } from 'react';
import { getEvents } from '../../services/eventService';
import type { Event } from '../../types/event';
import { fallbackEvents, getFillCount, getFillPercent } from '../pageData';

export default function EventAnalyticsPage() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents);

  useEffect(() => {
    getEvents().then(setEvents).catch(() => setEvents(fallbackEvents));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Analitik</div>
          <h1 className="panel-title">Etkinlik performansı</h1>
          <p className="panel-subtitle">Doluluk, başvuru ve check-in göstergelerini etkinlik bazında takip et.</p>
        </section>
        <div className="panel-grid">
          {events.map((event) => (
            <article className="panel-card" key={event.eventId}>
              <h2 className="panel-card__title">{event.title}</h2>
              <div className="panel-meta">
                <span className="chip">{getFillCount(event)} başvuru</span>
                <span className="chip">{event.capacity} kontenjan</span>
                <span className="status-pill">{getFillPercent(event)}% dolu</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${getFillPercent(event)}%` }} /></div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
