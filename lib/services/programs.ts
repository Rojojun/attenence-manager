import { apiClient } from '../api';
import type {
  ApiResponse,
  Program,
  CreateProgramInput,
  UpdateProgramInput,
  ProgramQueryParams,
  ProgramStats,
} from '../types';

export const programsService = {
  // 1. Get all programs with filtering and pagination
  async getAll(params?: ProgramQueryParams): Promise<ApiResponse<Program[]>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);

    const query = queryParams.toString();
    const endpoint = query ? `/api/programs?${query}` : '/api/programs';

    return apiClient.get<ApiResponse<Program[]>>(endpoint);
  },

  // 2. Get program by ID
  async getById(id: string): Promise<ApiResponse<Program>> {
    return apiClient.get<ApiResponse<Program>>(`/api/programs/${id}`);
  },

  // 3. Create new program
  async create(data: CreateProgramInput): Promise<ApiResponse<Program>> {
    return apiClient.post<ApiResponse<Program>>('/api/programs', data);
  },

  // 4. Update program
  async update(id: string, data: UpdateProgramInput): Promise<ApiResponse<Program>> {
    return apiClient.patch<ApiResponse<Program>>(`/api/programs/${id}`, data);
  },

  // 5. Delete program
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/programs/${id}`);
  },

  // 15. Get program statistics
  async getStats(id: string): Promise<ApiResponse<ProgramStats>> {
    return apiClient.get<ApiResponse<ProgramStats>>(`/api/programs/${id}/stats`);
  },
};
