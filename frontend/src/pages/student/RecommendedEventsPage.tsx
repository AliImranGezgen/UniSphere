// UniSphere notu: Recommended Events Page ogrenci deneyimindeki ana ekranlardan biridir.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, type RecommendationResult } from '../../services/aiService';
import { getEvents } from '../../services/eventService';
import type { Event } from '../../types/event';
import { fallbackEvents, formatDateTime, getFillPercent } from '../pageData';

export default function RecommendedEventsPage() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);

  useEffect(() => {
    getEvents().then(setEvents).catch(() => setEvents(fallbackEvents));
    aiService.getRecommendations().then(setRecommendations).catch(() => {
      setRecommendations(fallbackEvents.map((event, index) => ({
        eventId: event.eventId,
        score: 0.92 - index * 0.08,
        reason: index === 0 ? 'Teknoloji etkinliklerine ilgin yüksek görünüyor.' : 'Geçmiş katılımlarınla benzer kulüp etkinliği.',
        riskLevel: 'N/A',
      })));
    });
  }, []);

  const cards = useMemo(() => recommendations.map((recommendation) => ({
    recommendation,
    event: events.find((item) => item.eventId === recommendation.eventId) ?? fallbackEvents.find((item) => item.eventId === recommendation.eventId) ?? fallbackEvents[0],
  })), [events, recommendations]);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">AI Önerileri</div>
          <h1 className="panel-title">Sana özel etkinlikler</h1>
          <p className="panel-subtitle">Başvuru, katılım ve ilgi alanı sinyallerine göre öne çıkan etkinlikler.</p>
        </section>
        <div className="panel-grid panel-grid--wide">
          {cards.map(({ recommendation, event }) => (
            <article className="panel-card" key={`${recommendation.eventId}-${recommendation.score}`}>
              <div className="panel-card__top">
                <div>
                  <span className="chip">{event.clubName}</span>
                  <h2 className="panel-card__title" style={{ marginTop: 10 }}>{event.title}</h2>
                </div>
                <span className="status-pill status-pill--good">{Math.round(recommendation.score * 100)}% eşleşme</span>
              </div>
              <p className="panel-card__text">{recommendation.reason}</p>
              <div className="panel-meta">
                <span className="chip">{formatDateTime(event.eventDate)}</span>
                <span className="chip">{event.location}</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${getFillPercent(event)}%` }} /></div>
              <Link className="btn btn-primary" to={`/student/events/${event.eventId}`}>Detayı İncele</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
