// UniSphere notu: No Show Risk Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useEffect, useState } from 'react';
import NoShowRiskBadge from '../../components/ai/NoShowRiskBadge';
import { aiService, type NoShowRiskItem } from '../../services/aiService';

export default function NoShowRiskPage() {
  const [items, setItems] = useState<NoShowRiskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    aiService.getNoShowRisks()
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch(() => setError('No-show risk verisi şu anda alınamadı.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">AI Risk</div>
            <h1 className="panel-title">No-show tahmini</h1>
            <p className="panel-subtitle">Katılımcıların etkinliğe gelmeme riskini karar destek ekranı olarak incele. Bu alan otomatik karar vermez.</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-value">{items.length}</div><div className="metric-label">Analiz edilen kayıt</div></div>
            <div className="metric-card"><div className="metric-value">{items.filter((item) => item.riskLevel === 'High').length}</div><div className="metric-label">Yüksek risk</div></div>
          </div>
        </section>

        {loading ? <div className="notice">Risk analizi yükleniyor...</div> : null}
        {error ? <div className="notice notice-error">{error}</div> : null}
        {!loading && !error && items.length === 0 ? <div className="panel-card">Analiz edilecek onaylı katılımcı bulunamadı.</div> : null}

        <div className="table-card">
          <table className="panel-table">
            <thead><tr><th>Katılımcı</th><th>Etkinlik</th><th>Risk</th><th>Skor</th><th>Kısa neden</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.userId}-${item.eventId}`}>
                  <td>{item.studentName}</td>
                  <td>{item.eventTitle}</td>
                  <td><NoShowRiskBadge level={item.riskLevel} /></td>
                  <td>{Math.round(item.riskScore * 100)}%</td>
                  <td>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
