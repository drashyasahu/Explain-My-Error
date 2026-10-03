import api from './api';
import { DebugSession, SessionEntry, ApiResponse } from '../types';

export interface CreateSessionPayload {
  title: string;
  initialAnalysisId?: number;
}

export interface AddSessionStepPayload {
  analysisId?: number;
  userInput?: string;
  stepStatus?: string;
  resolutionNote?: string;
}

export const debugSessionService = {
  getAll: async (): Promise<DebugSession[]> => {
    const res = await api.get<ApiResponse<DebugSession[]>>('/debug-sessions');
    if (!res.data.success || !res.data.data) {
      return [];
    }
    return res.data.data;
  },

  getById: async (id: number): Promise<DebugSession> => {
    const res = await api.get<ApiResponse<DebugSession>>(`/debug-sessions/${id}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to fetch debug session');
    }
    return res.data.data;
  },

  create: async (payload: CreateSessionPayload): Promise<DebugSession> => {
    const res = await api.post<ApiResponse<DebugSession>>('/debug-sessions', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to create debug session');
    }
    return res.data.data;
  },

  addStep: async (sessionId: number, payload: AddSessionStepPayload): Promise<SessionEntry> => {
    const res = await api.post<ApiResponse<SessionEntry>>(`/debug-sessions/${sessionId}/steps`, payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to add step');
    }
    return res.data.data;
  },

  updateStatus: async (sessionId: number, status: 'ACTIVE' | 'RESOLVED'): Promise<DebugSession> => {
    const res = await api.patch<ApiResponse<DebugSession>>(`/debug-sessions/${sessionId}/status`, { status });
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to update session status');
    }
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/debug-sessions/${id}`);
  }
};
