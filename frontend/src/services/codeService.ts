import api from './api';
import { AnalysisRequest, AnalysisResponse, ApiResponse } from '../types';

export const codeService = {
  explainCode: async (request: Partial<AnalysisRequest>): Promise<AnalysisResponse> => {
    const res = await api.post<ApiResponse<AnalysisResponse>>('/code/explain', request);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Code explanation failed');
    }
    return res.data.data;
  },

  reviewCode: async (request: Partial<AnalysisRequest>): Promise<AnalysisResponse> => {
    const res = await api.post<ApiResponse<AnalysisResponse>>('/code/review', request);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Code review failed');
    }
    return res.data.data;
  }
};
