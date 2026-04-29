// UniSphere notu: Recommended Events Page ogrenci deneyimindeki ana ekranlardan biridir.
import { useEffect, useMemo, useState } from 'react';
import RecommendationCard from '../../components/ai/RecommendationCard';
import { aiService, type RecommendationResult } from '../../services/aiService';
import { getEvents } from '../../services/eventService';
import type { Event } from '../../types/event';

export default function RecommendedEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getEvents(), aiService.getRecommendations()])
      .then(([eventData, recommendationData]) => {
        setEvents(eventData);
        setRecommendations(recommendationData);
        setError(null);
      })
      .catch(() => setError('AI önerileri şu anda yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);

  const cards = useMemo(() => recommendations
    .map((recommendation) => ({
      recommendation,
      event: events.find((item) => item.eventId === recommendation.eventId),
    }))
    .filter((item): item is { recommendation: RecommendationResult; event: Event } => Boolean(item.event)),
  [events, recommendations]);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">AI Önerileri</div>
          <h1 className="panel-title">Sana özel etkinlikler</h1>
          <p className="panel-subtitle">Başvuru, katılım ve ilgi alanı sinyallerine göre öne çıkan etkinlikler.</p>
        </section>

        {loading ? <div className="notice">Öneriler yükleniyor...</div> : null}
        {error ? <div className="notice notice-error">{error}</div> : null}
        {!loading && !error && cards.length === 0 ? (
          <div className="panel-card">
            <h2 className="panel-card__title">Henüz öneri yok</h2>
            <p className="panel-card__text">Başvuru ve katılım geçmişin oluştukça bu alan kişiselleştirilmiş önerilerle dolacak.</p>
          </div>
        ) : null}

        <div className="panel-grid panel-grid--wide">
          {cards.map(({ recommendation, event }) => (
            <RecommendationCard
              key={`${recommendation.eventId}-${recommendation.score}`}
              recommendation={recommendation}
              event={event}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
