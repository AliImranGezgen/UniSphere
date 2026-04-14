// UniSphere notu: Ai Service API cagrilarini tek noktadan yonetmek icin ayrildi.
import { api } from './api';

export type RecommendationResult = {
  eventId: number;
  score: number;
  reason: string;
  riskLevel: string;
};

export type NoShowResult = {
  riskLevel: 'Low' | 'Medium' | 'High';
  score: number;
  reasons: string[];
};

export type ImproveDescriptionResult = {
  originalText: string;
  improvedText: string;
  explanations: string[];
};

export const aiService = {
  getRecommendations: async (): Promise<RecommendationResult[]> => {
    const response = await api.get<RecommendationResult[]>('ai/recommend');
    return response.data;
  },

  getNoShowPrediction: async (): Promise<NoShowResult> => {
    const response = await api.get<NoShowResult>('ai/noshow');
    return response.data;
  },

  improveDescription: async (text: string): Promise<ImproveDescriptionResult> => {
    const response = await api.post<ImproveDescriptionResult>('ai/improve-description', { textToImprove: text });
    return response.data;
  }
};
