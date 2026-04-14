// UniSphere notu: My Events Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteEvent, getEvents } from '../../services/eventService';
import type { Event } from '../../types/event';
import { fallbackEvents, formatDateTime, getFillPercent } from '../pageData';

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getEvents().then(setEvents).catch(() => setEvents(fallbackEvents));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      setEvents((current) => current.filter((event) => event.eventId !== id));
      setMessage('Etkinlik silindi.');
    } catch {
      setMessage('Demo modunda silme isteği simüle edildi.');
      setEvents((current) => current.filter((event) => event.eventId !== id));
    }
  };

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <div className="toolbar">
          <section className="panel-heading" style={{ flex: 1 }}>
            <div className="panel-eyebrow">Etkinlikler</div>
            <h1 className="panel-title">Etkinliklerim</h1>
            <p className="panel-subtitle">Kulübüne ait etkinlikleri yönet ve düzenleme akışına geç.</p>
          </section>
          <Link className="btn btn-primary" to="/club-admin/events/create" style={{ alignSelf: 'flex-start' }}>Yeni Etkinlik</Link>
        </div>
        {message ? <div className="notice" style={{ marginBottom: '1rem' }}>{message}</div> : null}
        <div className="table-card">
          <table className="panel-table">
            <thead><tr><th>Etkinlik</th><th>Tarih</th><th>Konum</th><th>Doluluk</th><th>Aksiyon</th></tr></thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.eventId}>
                  <td>{event.title}</td>
                  <td>{formatDateTime(event.eventDate)}</td>
                  <td>{event.location}</td>
                  <td>{getFillPercent(event)}%</td>
                  <td>
                    <div className="panel-actions" style={{ marginTop: 0 }}>
                      <Link className="btn btn-outline" to={`/club-admin/events/${event.eventId}/edit`}>Düzenle</Link>
                      <button className="btn btn-outline" onClick={() => void handleDelete(event.eventId)}>Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
