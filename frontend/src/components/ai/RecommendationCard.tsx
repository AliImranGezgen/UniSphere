// UniSphere notu: Recommendation Card AI sonucunu kullaniciya sade bir arayuz parcasi olarak verir.
import { Link } from 'react-router-dom';
import type { RecommendationResult } from '../../types/ai';
import type { Event } from '../../types/event';
import { formatDateTime } from '../../pages/pageData';

type Props = {
  recommendation: RecommendationResult;
  event: Event;
};

export default function RecommendationCard({ recommendation, event }: Props) {
  return (
    <article className="panel-card">
      <div className="panel-card__top">
        <div>
          <span className="chip">{event.clubName || `Kulüp #${event.clubId}`}</span>
          <h2 className="panel-card__title" style={{ marginTop: 10 }}>{event.title}</h2>
        </div>
        <span className="status-pill status-pill--good">{Math.round(recommendation.score * 100)}% eşleşme</span>
      </div>
      <p className="panel-card__text">
        <strong>Neden önerildi?</strong><br />
        {recommendation.reason || 'Başvuru ve katılım geçmişinize göre öne çıkarıldı.'}
      </p>
      <div className="panel-meta">
        <span className="chip">{formatDateTime(event.eventDate)}</span>
        <span className="chip">{event.location}</span>
      </div>
      <Link className="btn btn-primary" to={`/student/events/${event.eventId}`}>Detayı İncele</Link>
    </article>
  );
}
