// UniSphere notu: No Show Risk Badge AI sonucunu kullaniciya sade bir arayuz parcasi olarak verir.
import type { AiRiskLevel } from '../../types/ai';
import { statusClass } from '../../pages/pageData';

type Props = {
  level: AiRiskLevel;
};

const labelMap: Record<AiRiskLevel, string> = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
};

export default function NoShowRiskBadge({ level }: Props) {
  return <span className={statusClass(level)}>{labelMap[level]}</span>;
}
