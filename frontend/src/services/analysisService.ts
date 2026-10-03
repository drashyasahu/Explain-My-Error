import api from './api';
import { AnalysisRequest, AnalysisResponse, ApiResponse, PageResponse, FollowUpMessage } from '../types';

export const analysisService = {
  // Analyze error (supports guest and authenticated users)
  analyze: async (request: AnalysisRequest): Promise<AnalysisResponse> => {
    const response = await api.post<ApiResponse<AnalysisResponse>>('/analyses', request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Analysis failed');
    }
    return response.data.data;
  },

  // Get specific analysis by ID
  getById: async (id: number): Promise<AnalysisResponse> => {
    const response = await api.get<ApiResponse<AnalysisResponse>>(`/analyses/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch analysis');
    }
    return response.data.data;
  },

  // Get user analysis history with pagination & optional filtering
  getHistory: async (page = 0, size = 10, language?: string, severity?: string): Promise<PageResponse<AnalysisResponse>> => {
    const params: Record<string, any> = { page, size };
    if (language && language !== 'ALL') params.language = language;
    if (severity && severity !== 'ALL') params.severity = severity;

    const response = await api.get<ApiResponse<PageResponse<AnalysisResponse>>>('/analyses', { params });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch history');
    }
    return response.data.data;
  },

  // Delete analysis
  delete: async (id: number): Promise<void> => {
    await api.delete(`/analyses/${id}`);
  },

  // Ask follow-up question
  askFollowUp: async (analysisId: number, question: string): Promise<FollowUpMessage> => {
    const response = await api.post<ApiResponse<FollowUpMessage>>(`/analyses/${analysisId}/follow-up`, { question });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Follow-up question failed');
    }
    return response.data.data;
  },

  // Get follow-up messages for analysis
  getFollowUps: async (analysisId: number): Promise<FollowUpMessage[]> => {
    const response = await api.get<ApiResponse<FollowUpMessage[]>>(`/analyses/${analysisId}/follow-up`);
    if (!response.data.success || !response.data.data) {
      return [];
    }
    return response.data.data;
  },

  // Get recent analyses for quick access
  getRecent: async (limit = 5): Promise<AnalysisResponse[]> => {
    const response = await api.get<ApiResponse<AnalysisResponse[]>>('/analyses/recent', { params: { limit } });
    if (!response.data.success || !response.data.data) {
      return [];
    }
    return response.data.data;
  }
};
