// UniSphere notu: Edit Event Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventDescriptionAssistant from '../../components/ai/EventDescriptionAssistant';
import { getEventById, updateEventForm } from '../../services/eventService';
import type { Event } from '../../types/event';

const toInputDate = (value: string) => new Date(value).toISOString().slice(0, 16);

export default function EditEventPage() {
  const { eventId } = useParams();
  const numericId = Number(eventId);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!numericId) return;
    getEventById(numericId)
      .then((event) => {
        setEventData(event);
        setDescription(event.description);
      })
      .catch(() => setError('Etkinlik yüklenemedi.'));
  }, [numericId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!eventData) return;
    const form = new FormData(event.currentTarget);
    form.set('EventId', String(eventData.eventId));
    form.set('ClubName', eventData.clubName ?? '');
    form.set('Description', description);
    try {
      await updateEventForm(eventData.eventId, form);
      setMessage('Etkinlik güncellendi.');
    } catch {
      setMessage('Etkinlik güncellenemedi. Lütfen API bağlantısını ve yetkinizi kontrol edin.');
    }
  };

  if (error) {
    return <div className="panel-page"><div className="panel-shell"><div className="notice notice-error">{error}</div></div></div>;
  }

  if (!eventData) {
    return <div className="panel-page"><div className="panel-shell"><div className="notice">Etkinlik yükleniyor...</div></div></div>;
  }

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Düzenle</div>
          <h1 className="panel-title">{eventData.title}</h1>
          <p className="panel-subtitle">Etkinlik bilgilerini güncelle ve açıklamayı AI yardımıyla iyileştir.</p>
        </section>
        <form className="panel-card form-grid" onSubmit={(event) => void handleSubmit(event)}>
          <label className="form-label">Başlık<input className="input" name="Title" defaultValue={eventData.title} required maxLength={100} /></label>
          <label className="form-label">Kulüp ID<input className="input" name="ClubId" type="number" min="1" defaultValue={eventData.clubId} required /></label>
          <label className="form-label">Tarih<input className="input" name="EventDate" type="datetime-local" defaultValue={toInputDate(eventData.eventDate)} required /></label>
          <label className="form-label">Kontenjan<input className="input" name="Capacity" type="number" min="1" defaultValue={eventData.capacity} required /></label>
          <label className="form-label">Konum<input className="input" name="Location" defaultValue={eventData.location} required /></label>
          <label className="form-label">Yeni afiş<input className="input" name="PosterImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
          <label className="form-label full">Açıklama<textarea className="textarea" name="Description" value={description} onChange={(event) => setDescription(event.target.value)} required maxLength={500} /></label>
          <EventDescriptionAssistant text={description} onApply={setDescription} />
          <button className="btn btn-primary" type="submit">Değişiklikleri Kaydet</button>
          {message ? <div className="notice full">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
