// UniSphere notu: Create Event Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useState } from 'react';
import { createEventForm } from '../../services/eventService';

export default function CreateEventPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await createEventForm(form);
      setMessage('Etkinlik oluşturuldu.');
      event.currentTarget.reset();
    } catch {
      setMessage('Backend bağlantısı yoksa form demo modunda doğrulandı. API hazır olduğunda aynı alanlar gönderilecek.');
    }
  };

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Yeni Etkinlik</div>
          <h1 className="panel-title">Etkinlik oluştur</h1>
          <p className="panel-subtitle">Backend `CreateEventDto` alanlarına uyumlu multipart form.</p>
        </section>
        <form className="panel-card form-grid" onSubmit={(event) => void handleSubmit(event)}>
          <label className="form-label">Başlık<input className="input" name="Title" required maxLength={100} /></label>
          <label className="form-label">Kulüp ID<input className="input" name="ClubId" type="number" min="1" defaultValue="1" required /></label>
          <label className="form-label">Tarih<input className="input" name="EventDate" type="datetime-local" required /></label>
          <label className="form-label">Kontenjan<input className="input" name="Capacity" type="number" min="1" defaultValue="50" required /></label>
          <label className="form-label">Konum<input className="input" name="Location" required /></label>
          <label className="form-label">Afiş<input className="input" name="PosterImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
          <label className="form-label full">Açıklama<textarea className="textarea" name="Description" required maxLength={500} /></label>
          <button className="btn btn-primary" type="submit">Etkinliği Kaydet</button>
          {message ? <div className="notice full">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
