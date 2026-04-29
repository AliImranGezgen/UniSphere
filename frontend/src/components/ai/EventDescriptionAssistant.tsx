import { useState } from 'react';
import { aiService, type DescriptionImprovementResult } from '../../services/aiService';

type Props = {
  text: string;
  onApply: (value: string) => void;
};

export default function EventDescriptionAssistant({ text, onApply }: Props) {
  const [result, setResult] = useState<DescriptionImprovementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImprove = async () => {
    if (!text.trim()) {
      setError('Öneri alabilmek için önce açıklama metni girin.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await aiService.improveDescription({ originalText: text });
      setResult(response);
    } catch {
      setError('AI önerisi alınamadı. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel-card full" style={{ background: '#f8fafc' }}>
      <div className="panel-card__top">
        <div>
          <h2 className="panel-card__title">AI açıklama yardımcısı</h2>
          <p className="panel-card__text">Metni daha açık, okunabilir ve etkinlik sayfasına uygun hale getirmek için öneri al.</p>
        </div>
        <button className="btn btn-outline" type="button" onClick={() => void handleImprove()} disabled={loading}>
          {loading ? 'İyileştiriliyor...' : 'AI ile iyileştir'}
        </button>
      </div>

      {error ? <div className="notice notice-error">{error}</div> : null}

      {result ? (
        <div className="panel-grid" style={{ marginTop: '1rem' }}>
          <div className="panel-card">
            <h3 className="panel-card__title">Original text</h3>
            <p className="panel-card__text">{result.originalText}</p>
          </div>
          <div className="panel-card">
            <h3 className="panel-card__title">Improved text</h3>
            <p className="panel-card__text">{result.improvedText}</p>
          </div>
          <div className="panel-card">
            <h3 className="panel-card__title">Notes</h3>
            <p className="panel-card__text">{result.notes}</p>
            <div className="panel-actions">
              <button className="btn btn-primary" type="button" onClick={() => onApply(result.improvedText)}>Uygula</button>
              <button className="btn btn-outline" type="button" onClick={() => setResult(null)}>Vazgeç</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
