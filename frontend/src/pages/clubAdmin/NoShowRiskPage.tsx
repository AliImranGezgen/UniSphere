// UniSphere notu: No Show Risk Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useEffect, useState } from 'react';
import { aiService, type NoShowResult } from '../../services/aiService';
import { statusClass } from '../pageData';

export default function NoShowRiskPage() {
  const [risk, setRisk] = useState<NoShowResult>({ riskLevel: 'Medium', score: 48, reasons: ['Kullanıcının geçmiş etkinlik verisi sınırlı.', 'Onay sonrası check-in davranışı izlenmeli.'] });

  useEffect(() => {
    aiService.getNoShowPrediction().then(setRisk).catch(() => undefined);
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">AI Risk</div>
            <h1 className="panel-title">No-show tahmini</h1>
            <p className="panel-subtitle">Katılımcıların etkinliğe gelmeme riskini karar destek ekranı olarak incele.</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-value">{risk.score}</div><div className="metric-label">Risk skoru</div></div>
            <div className="metric-card"><div className="metric-value">{risk.riskLevel}</div><div className="metric-label">Risk seviyesi</div></div>
          </div>
        </section>
        <div className="panel-card">
          <span className={statusClass(risk.riskLevel)}>{risk.riskLevel}</span>
          <h2 className="panel-card__title">Açıklamalar</h2>
          {risk.reasons.map((reason) => <p className="panel-card__text" key={reason}>{reason}</p>)}
        </div>
      </div>
    </div>
  );
}
