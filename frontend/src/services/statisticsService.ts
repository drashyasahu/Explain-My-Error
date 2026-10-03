import api from './api';
import { Statistics, ApiResponse } from '../types';

export const statisticsService = {
  getStatistics: async (): Promise<Statistics> => {
    const res = await api.get<ApiResponse<Statistics>>('/statistics');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to fetch statistics');
    }
    return res.data.data;
  }
};
