// UniSphere notu: Create Event Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useState } from 'react';
import axios from 'axios';
import EventDescriptionAssistant from '../../components/ai/EventDescriptionAssistant';
import { createEventForm, getEvents } from '../../services/eventService';

export default function CreateEventPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    form.set('Description', description);
    const submittedTitle = String(form.get('Title') ?? '').trim();
    const submittedDate = String(form.get('EventDate') ?? '').trim();
    const submittedClubId = Number(form.get('ClubId') ?? 0);
    const submittedLocation = String(form.get('Location') ?? '').trim();

    const showSuccess = () => {
      setIsError(false);
      setMessage('Etkinlik olusturuldu.');
      setDescription('');
      formElement.reset();
    };

    try {
      await createEventForm(form);
      showSuccess();
    } catch (error) {
      const createdDespiteError = await wasEventCreated(submittedTitle, submittedDate, submittedClubId, submittedLocation);
      if (createdDespiteError) {
        showSuccess();
        return;
      }

      setIsError(true);
      const fallback = 'Etkinlik olusturulamadi. Lutfen API baglantisini ve form alanlarini kontrol edin.';
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const detail =
          typeof responseData === 'string'
            ? responseData
            : responseData?.message ?? responseData?.detail;
        setMessage(detail || fallback);
        return;
      }
      setMessage(fallback);
    }
  };

  const wasEventCreated = async (title: string, eventDate: string, clubId: number, location: string) => {
    if (!title || !eventDate) return false;

    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        const events = await getEvents();
        const normalizedTitle = normalize(title);
        const normalizedLocation = normalize(location);
        const found = events.some((item) => {
          const titleMatches = normalize(item.title) === normalizedTitle;
          const clubMatches = !clubId || item.clubId === clubId;
          const locationMatches = !normalizedLocation || normalize(item.location) === normalizedLocation;
          const dateMatches = item.eventDate.startsWith(eventDate) || item.eventDate.slice(0, 16) === eventDate;
          return titleMatches && clubMatches && (dateMatches || locationMatches);
        });

        if (found) return true;
      } catch {
        // Bir sonraki kisa denemede tekrar kontrol edilir.
      }

      await wait(300);
    }

    return false;
  };

  const normalize = (value: string) => value.trim().toLocaleLowerCase('tr-TR');
  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

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
          {message ? <div className={`notice ${isError ? 'notice-error' : 'notice-success'} full`}>{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
