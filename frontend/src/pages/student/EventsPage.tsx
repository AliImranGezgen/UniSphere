import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';
import type { Event } from '../../types/event';
import { fallbackEvents, formatDateTime, getFillPercent } from '../pageData';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => setEvents(fallbackEvents))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return events
      .filter((event) => !needle || [event.title, event.clubName, event.location, event.description].some((value) => value.toLowerCase().includes(needle)))
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }, [events, query]);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">Öğrenci</div>
            <h1 className="panel-title">Etkinlikleri keşfet</h1>
            <p className="panel-subtitle">Kulüplerin yayınladığı etkinlikleri filtrele, kontenjan durumunu gör ve başvuru akışına geç.</p>
            <div className="panel-actions">
              <input className="input" style={{ maxWidth: 420 }} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Etkinlik, kulüp veya konum ara" />
            </div>
          </div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-value">{events.length}</div><div className="metric-label">Toplam etkinlik</div></div>
            <div className="metric-card"><div className="metric-value">{new Set(events.map((event) => event.clubId)).size}</div><div className="metric-label">Kulüp</div></div>
            <div className="metric-card"><div className="metric-value">{events.reduce((sum, event) => sum + event.capacity, 0)}</div><div className="metric-label">Kontenjan</div></div>
            <div className="metric-card"><div className="metric-value">{filtered.length}</div><div className="metric-label">Listelenen</div></div>
          </div>
        </section>

        {loading ? <div className="notice">Etkinlikler yükleniyor...</div> : null}

        <div className="panel-grid panel-grid--wide">
          {filtered.map((event) => {
            const percent = getFillPercent(event);
            return (
              <article className="panel-card" key={event.eventId}>
                <div className="panel-card__top">
                  <div>
                    <span className="chip">{event.clubName || `Kulüp #${event.clubId}`}</span>
                    <h2 className="panel-card__title" style={{ marginTop: 10 }}>{event.title}</h2>
                  </div>
                  <span className="status-pill">{percent}% dolu</span>
                </div>
                <p className="panel-card__text">{event.description}</p>
                <div className="panel-meta">
                  <span className="chip">{formatDateTime(event.eventDate)}</span>
                  <span className="chip">{event.location}</span>
                  <span className="chip">{event.capacity} kontenjan</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
                <div className="panel-actions">
                  <Link className="btn btn-primary" to={`/student/events/${event.eventId}`}>Detaya Git</Link>
                  <Link className="btn btn-outline" to={`/student/ticket/${event.eventId}`}>Bilet Önizle</Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
