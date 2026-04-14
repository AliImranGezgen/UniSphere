import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, updateEventForm } from '../../services/eventService';
import { aiService, type ImproveDescriptionResult } from '../../services/aiService';
import type { Event } from '../../types/event';
import { fallbackEvents } from '../pageData';

const toInputDate = (value: string) => new Date(value).toISOString().slice(0, 16);

export default function EditEventPage() {
  const { eventId } = useParams();
  const numericId = Number(eventId);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // AI Assistant States
  const [description, setDescription] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [improvementResult, setImprovementResult] = useState<ImproveDescriptionResult | null>(null);

  useEffect(() => {
    if (!numericId) return;
    getEventById(numericId)
      .then((data) => {
        setEventData(data);
        setDescription(data.description || '');
      })
      .catch(() => {
        const fallback = fallbackEvents.find((event) => event.eventId === numericId) ?? fallbackEvents[0];
        setEventData(fallback);
        setDescription(fallback.description || '');
      });
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

  const handleImproveDescription = async () => {
    if (!description.trim()) return;
    setIsImproving(true);
    try {
      const result = await aiService.improveDescription(description);
      setImprovementResult(result);
    } catch (error) {
      console.error("AI improvement failed", error);
      setMessage("Yapay zeka asistanı şu an hizmet veremiyor.");
    } finally {
      setIsImproving(false);
    }
  };

  const acceptImprovement = () => {
    if (improvementResult) {
      setDescription(improvementResult.improvedText);
      setImprovementResult(null);
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
        <form className="panel-card form-grid" onSubmit={handleSubmit}>
          <label className="form-label">Başlık<input className="input" name="Title" defaultValue={eventData.title} required maxLength={100} /></label>
          <label className="form-label">Kulüp ID<input className="input" name="ClubId" type="number" min="1" defaultValue={eventData.clubId} required /></label>
          <label className="form-label">Tarih<input className="input" name="EventDate" type="datetime-local" defaultValue={toInputDate(eventData.eventDate)} required /></label>
          <label className="form-label">Kontenjan<input className="input" name="Capacity" type="number" min="1" defaultValue={eventData.capacity} required /></label>
          <label className="form-label">Konum<input className="input" name="Location" defaultValue={eventData.location} required /></label>
          <label className="form-label">Yeni afiş<input className="input" name="PosterImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
          
          <div className="form-label full" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span>Açıklama</span>
               <button 
                 type="button" 
                 className="btn" 
                 style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                 onClick={handleImproveDescription}
                 disabled={isImproving || !description.trim()}
               >
                 ✨ {isImproving ? "İyileştiriliyor..." : "Açıklamayı İyileştir"}
               </button>
             </div>
             <textarea 
               className="textarea" 
               name="Description" 
               required 
               maxLength={500} 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
             />
             
             {/* AI İyileştirme Çıktısı */}
             {improvementResult && (
               <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '4px', padding: '1rem', marginTop: '0.5rem' }}>
                 <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.5rem' }}>✨ AI Önerisi</p>
                 <p style={{ fontSize: '0.9rem', color: '#0c4a6e', marginBottom: '1rem' }}>{improvementResult.improvedText}</p>
                 
                 {improvementResult.explanations?.length > 0 && (
                   <ul style={{ fontSize: '0.8rem', color: '#0369a1', margin: '0 0 1rem 1.5rem' }}>
                     {improvementResult.explanations.map((exp, idx) => <li key={idx}>{exp}</li>)}
                   </ul>
                 )}
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button type="button" className="btn btn-primary" onClick={acceptImprovement}>Kabul Et</button>
                   <button type="button" className="btn" onClick={() => setImprovementResult(null)}>Reddet</button>
                 </div>
               </div>
             )}
          </div>
          
          <button className="btn btn-primary full" type="submit">Değişiklikleri Kaydet</button>
          {message ? <div className="notice full">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
