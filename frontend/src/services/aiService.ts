// UniSphere notu: AI Service API cagrilarini tek noktadan yonetmek icin ayrildi.
import { api } from './api';
import type {
  DescriptionImprovementRequest,
  DescriptionImprovementResult,
  NoShowPrediction,
  NoShowPredictionRequest,
  NoShowResult,
  NoShowRiskItem,
  RecommendationResult,
  SuspiciousReviewRequest,
  SuspiciousReviewResult,
} from '../types/ai';

export const aiService = {
  getRecommendations: async (): Promise<RecommendationResult[]> => {
    const response = await api.get<RecommendationResult[]>('ai/recommend');
    return response.data;
  },

  getRecommendationsForUser: async (userId: number): Promise<RecommendationResult[]> => {
    const response = await api.get<RecommendationResult[]>(`ai/recommend-events/${userId}`);
    return response.data;
  },

  getNoShowPrediction: async (): Promise<NoShowResult> => {
    const response = await api.get<NoShowResult>('ai/noshow');
    return response.data;
  },

  predictNoShow: async (request: NoShowPredictionRequest): Promise<NoShowPrediction> => {
    const response = await api.post<NoShowPrediction>('ai/predict-noshow', request);
    return response.data;
  },

  getNoShowRisks: async (): Promise<NoShowRiskItem[]> => {
    const response = await api.get<NoShowRiskItem[]>('ai/no-show-risks');
    return response.data;
  },

  detectSuspiciousReview: async (request: SuspiciousReviewRequest): Promise<SuspiciousReviewResult> => {
    const response = await api.post<SuspiciousReviewResult>('ai/detect-suspicious-review', request);
    return response.data;
  },

  getSuspiciousReviews: async (): Promise<SuspiciousReviewItem[]> => {
    const response = await api.get<SuspiciousReviewItem[]>('ai/suspicious-reviews');
    return response.data;
  },

  improveDescription: async (request: DescriptionImprovementRequest): Promise<DescriptionImprovementResult> => {
    const response = await api.post<DescriptionImprovementResult>('ai/improve-description', request);
    return response.data;
  },
};

export type {
  DescriptionImprovementResult,
  NoShowPrediction,
  NoShowResult,
  NoShowRiskItem,
  RecommendationResult,
  SuspiciousReviewItem,
  SuspiciousReviewResult,
};
