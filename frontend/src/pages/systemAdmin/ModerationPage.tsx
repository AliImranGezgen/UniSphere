// UniSphere notu: Moderation Page sistem yoneticisi tarafindaki kontrol ekranini temsil eder.
import { useState } from 'react';
import { statusClass } from '../pageData';

const initialItems = [
  { id: 1, target: 'AI ve Gelecek Zirvesi yorumu', reason: 'Şüpheli tekrar eden ifade', status: 'İncelemede' },
  { id: 2, target: 'Kariyer Kulübü etkinlik açıklaması', reason: 'Eksik lokasyon bilgisi', status: 'İncelemede' },
  { id: 3, target: 'Müzik Kulübü duyurusu', reason: 'Onaylandı', status: 'Aktif' },
];

export default function ModerationPage() {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Moderasyon</div>
          <h1 className="panel-title">İnceleme kuyruğu</h1>
          <p className="panel-subtitle">Yorum, etkinlik açıklaması ve kulüp içeriklerini yayın kalitesi açısından yönet.</p>
        </section>
        <div className="panel-grid">
          {items.map((item) => (
            <article className="panel-card" key={item.id}>
              <div className="panel-card__top">
                <h2 className="panel-card__title">{item.target}</h2>
                <span className={statusClass(item.status)}>{item.status}</span>
              </div>
              <p className="panel-card__text">{item.reason}</p>
              <div className="panel-actions">
                <button className="btn btn-primary" onClick={() => setItems((current) => current.map((row) => row.id === item.id ? { ...row, status: 'Aktif' } : row))}>Onayla</button>
                <button className="btn btn-outline" onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}>Kaldır</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
