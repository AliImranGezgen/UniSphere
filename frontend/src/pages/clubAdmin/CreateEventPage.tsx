import { useState } from 'react';
import { createEventForm } from '../../services/eventService';
import { aiService, type ImproveDescriptionResult } from '../../services/aiService';

export default function CreateEventPage() {
  const [message, setMessage] = useState<string | null>(null);
  
  // AI Assistant States
  const [description, setDescription] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [improvementResult, setImprovementResult] = useState<ImproveDescriptionResult | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await createEventForm(form);
      setMessage('Etkinlik oluşturuldu.');
      event.currentTarget.reset();
      setDescription('');
      setImprovementResult(null);
    } catch {
      setMessage('Backend bağlantısı yoksa form demo modunda doğrulandı. API hazır olduğunda aynı alanlar gönderilecek.');
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

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Yeni Etkinlik</div>
          <h1 className="panel-title">Etkinlik oluştur</h1>
          <p className="panel-subtitle">Backend `CreateEventDto` alanlarına uyumlu form.</p>
        </section>
        <form className="panel-card form-grid" onSubmit={handleSubmit}>
          <label className="form-label">Başlık<input className="input" name="Title" required maxLength={100} /></label>
          <label className="form-label">Kulüp ID<input className="input" name="ClubId" type="number" min="1" defaultValue="1" required /></label>
          <label className="form-label">Tarih<input className="input" name="EventDate" type="datetime-local" required /></label>
          <label className="form-label">Kontenjan<input className="input" name="Capacity" type="number" min="1" defaultValue="50" required /></label>
          <label className="form-label">Konum<input className="input" name="Location" required /></label>
          <label className="form-label">Afiş<input className="input" name="PosterImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
          
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
             
             {/* AI İyileştirme Çıktısı (Diff / Öneri Görünümü) */}
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
          
          <button className="btn btn-primary full" type="submit">Etkinliği Kaydet</button>
          {message ? <div className="notice full">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
