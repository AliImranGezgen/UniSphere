// UniSphere notu: Create Event Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useState } from 'react';
import EventDescriptionAssistant from '../../components/ai/EventDescriptionAssistant';
import { createEventForm } from '../../services/eventService';

export default function CreateEventPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set('Description', description);
    try {
      await createEventForm(form);
      setMessage('Etkinlik oluşturuldu.');
      setDescription('');
      event.currentTarget.reset();
    } catch {
      setMessage('Etkinlik oluşturulamadı. Lütfen API bağlantısını ve form alanlarını kontrol edin.');
    }
  };

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Yeni Etkinlik</div>
          <h1 className="panel-title">Etkinlik oluştur</h1>
          <p className="panel-subtitle">Etkinlik bilgilerini gir, açıklama metnini AI yardımıyla iyileştir.</p>
        </section>
        <form className="panel-card form-grid" onSubmit={(event) => void handleSubmit(event)}>
          <label className="form-label">Başlık<input className="input" name="Title" required maxLength={100} /></label>
          <label className="form-label">Kulüp ID<input className="input" name="ClubId" type="number" min="1" defaultValue="1" required /></label>
          <label className="form-label">Tarih<input className="input" name="EventDate" type="datetime-local" required /></label>
          <label className="form-label">Kontenjan<input className="input" name="Capacity" type="number" min="1" defaultValue="50" required /></label>
          <label className="form-label">Konum<input className="input" name="Location" required /></label>
          <label className="form-label">Afiş<input className="input" name="PosterImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
          <label className="form-label full">Açıklama<textarea className="textarea" name="Description" required maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
          <EventDescriptionAssistant text={description} onApply={setDescription} />
          <button className="btn btn-primary" type="submit">Etkinliği Kaydet</button>
          {message ? <div className="notice full">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
