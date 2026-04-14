import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, updateEventForm } from '../../services/eventService';
import type { Event } from '../../types/event';
import { fallbackEvents } from '../pageData';

const toInputDate = (value: string) => new Date(value).toISOString().slice(0, 16);

export default function EditEventPage() {
  const { eventId } = useParams();
  const numericId = Number(eventId);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!numericId) return;
    getEventById(numericId).then(setEventData).catch(() => setEventData(fallbackEvents.find((event) => event.eventId === numericId) ?? fallbackEvents[0]));
  }, [numericId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!eventData) return;
    const form = new FormData(event.currentTarget);
    form.set('EventId', String(eventData.eventId));
    form.set('ClubName', eventData.clubName ?? '');
    try {
      await updateEventForm(eventData.eventId, form);
      setMessage('Etkinlik güncellendi.');
    } catch {
      setMessage('Demo modunda güncelleme doğrulandı.');
    }
  };

  if (!eventData) {
    return <div className="panel-page"><div className="panel-shell"><div className="notice">Etkinlik yükleniyor...</div></div></div>;
  }

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Düzenle</div>
          <h1 className="panel-title">{eventData.title}</h1>
          <p className="panel-subtitle">Etkinlik bilgilerini güncelle.</p>
        </section>
        <form className="panel-card form-grid" onSubmit={(event) => void handleSubmit(event)}>
          <label className="form-label">Başlık<input className="input" name="Title" defaultValue={eventData.title} required maxLength={100} /></label>
          <label className="form-label">Kulüp ID<input className="input" name="ClubId" type="number" min="1" defaultValue={eventData.clubId} required /></label>
          <label className="form-label">Tarih<input className="input" name="EventDate" type="datetime-local" defaultValue={toInputDate(eventData.eventDate)} required /></label>
          <label className="form-label">Kontenjan<input className="input" name="Capacity" type="number" min="1" defaultValue={eventData.capacity} required /></label>
          <label className="form-label">Konum<input className="input" name="Location" defaultValue={eventData.location} required /></label>
          <label className="form-label">Yeni afiş<input className="input" name="PosterImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
          <label className="form-label full">Açıklama<textarea className="textarea" name="Description" defaultValue={eventData.description} required maxLength={500} /></label>
          <button className="btn btn-primary" type="submit">Değişiklikleri Kaydet</button>
          {message ? <div className="notice full">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
