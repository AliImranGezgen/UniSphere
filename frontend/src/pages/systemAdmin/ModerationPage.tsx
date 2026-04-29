// UniSphere notu: Moderation Page sistem yoneticisi tarafindaki kontrol ekranini temsil eder.
import { useEffect, useState } from 'react';
import SuspiciousReviewBadge from '../../components/ai/SuspiciousReviewBadge';
import { aiService, type SuspiciousReviewItem } from '../../services/aiService';

export default function ModerationPage() {
  const [items, setItems] = useState<SuspiciousReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    aiService.getSuspiciousReviews()
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch(() => setError('Şüpheli yorum analizi şu anda alınamadı.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">AI Moderasyon</div>
          <h1 className="panel-title">Şüpheli yorum kuyruğu</h1>
          <p className="panel-subtitle">Yorumları risk nedeni ve içerik bağlamıyla incele; son karar sistem yöneticisindedir.</p>
        </section>

        {loading ? <div className="notice">Yorumlar analiz ediliyor...</div> : null}
        {error ? <div className="notice notice-error">{error}</div> : null}
        {!loading && !error && items.length === 0 ? <div className="panel-card">İncelenecek şüpheli yorum bulunamadı.</div> : null}

        <div className="panel-grid">
          {items.map((item) => (
            <article className="panel-card" key={item.reviewId}>
              <div className="panel-card__top">
                <div>
                  <span className="chip">{item.eventTitle}</span>
                  <h2 className="panel-card__title" style={{ marginTop: 10 }}>{item.reviewerName}</h2>
                </div>
                <SuspiciousReviewBadge level={item.riskLevel} />
              </div>
              <p className="panel-card__text">{item.comment || 'Yorum metni boş.'}</p>
              <div className="panel-meta">
                <span className="chip">Puan: {item.rating}/5</span>
                <span className="chip">{new Date(item.createdAt).toLocaleString('tr-TR')}</span>
              </div>
              <p className="panel-card__text"><strong>Risk nedeni:</strong> {item.reason}</p>
              <div className="panel-actions">
                <button className="btn btn-primary" onClick={() => setItems((current) => current.filter((row) => row.reviewId !== item.reviewId))}>İncelendi</button>
                <button className="btn btn-outline" onClick={() => setItems((current) => current.filter((row) => row.reviewId !== item.reviewId))}>Kaldır</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
