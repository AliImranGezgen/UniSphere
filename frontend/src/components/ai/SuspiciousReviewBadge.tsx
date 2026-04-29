// UniSphere notu: Suspicious Review Badge AI sonucunu kullaniciya sade bir arayuz parcasi olarak verir.
import type { AiRiskLevel } from '../../types/ai';
import { statusClass } from '../../pages/pageData';

type Props = {
  level: AiRiskLevel;
};

export default function SuspiciousReviewBadge({ level }: Props) {
  return <span className={statusClass(level)}>{level} risk</span>;
}
