// UniSphere notu: Review Page ogrenci deneyimindeki ana ekranlardan biridir.
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ReviewPage() {
  const { eventId } = useParams();
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Geri Bildirim</div>
          <h1 className="panel-title">Etkinliği değerlendir</h1>
          <p className="panel-subtitle">Etkinlik #{eventId ?? 'seçili'} için yorumunu paylaş. Check-in kontrolü backend servisi bağlandığında bu form doğrudan kullanılabilir.</p>
        </section>
        <form className="panel-card" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
          <label className="form-label">Puan
            <select className="select" value={rating} onChange={(event) => setRating(event.target.value)}>
              <option value="5">5 - Çok iyi</option>
              <option value="4">4 - İyi</option>
              <option value="3">3 - Orta</option>
              <option value="2">2 - Zayıf</option>
              <option value="1">1 - Geliştirilmeli</option>
            </select>
          </label>
          <label className="form-label">Yorum
            <textarea className="textarea" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Etkinlik deneyimini yaz" />
          </label>
          <button className="btn btn-primary" type="submit">Yorumu Kaydet</button>
          {saved ? <div className="notice">Yorum taslak olarak kaydedildi.</div> : null}
        </form>
      </div>
    </div>
  );
}
