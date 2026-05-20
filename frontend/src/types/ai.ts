// UniSphere notu: AI ile ilgili frontend tipleri backend contract'lariyla uyumlu tutulur.
export type AiRiskLevel = 'Low' | 'Medium' | 'High';

export interface AiResponseMeta {
  model: string;
  version?: string;
  generatedAt?: string;
  isDecisionSupportOnly?: boolean;
}

export interface AiExplanation {
  code: string;
  message: string;
  weight?: number;
}

export interface RecommendationResult {
  eventId: number;
  eventTitle?: string;
  clubName?: string;
  score: number;
  reason: string;
  explanations?: AiExplanation[];
  meta?: AiResponseMeta;
}

export interface NoShowResult {
  riskLevel: AiRiskLevel;
  score: number;
  reasons: string[];
  meta?: AiResponseMeta;
}

export interface NoShowPredictionRequest {
  userId: number;
  eventId: number;
}

export interface NoShowPrediction {
  userId: number;
  eventId: number;
  riskLevel: AiRiskLevel;
  riskScore: number;
  reason: string;
  explanations?: AiExplanation[];
}

export interface NoShowRiskItem extends NoShowPrediction {
  studentName: string;
  eventTitle: string;
}

export interface SuspiciousReviewRequest {
  reviewId: number;
  comment: string;
}

export interface SuspiciousReviewResult {
  reviewId: number;
  riskLevel: AiRiskLevel;
  reason: string;
}

export interface SuspiciousReviewItem extends SuspiciousReviewResult {
  eventTitle: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DescriptionImprovementRequest {
  originalText: string;
}

export interface DescriptionImprovementResult {
  originalText: string;
  improvedText: string;
  notes: string;
}
