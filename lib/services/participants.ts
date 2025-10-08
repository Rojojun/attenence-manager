import { apiClient } from '../api';
import type {
  ApiResponse,
  Participant,
  CreateParticipantInput,
  UpdateParticipantInput,
  ParticipantQueryParams,
  ParticipantDetailStats,
} from '../types';

export const participantsService = {
  // 6. Get all participants with filtering
  async getAll(params?: ParticipantQueryParams): Promise<ApiResponse<Participant[]>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.program_id) queryParams.append('program_id', params.program_id);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.gift_received !== undefined) {
      queryParams.append('gift_received', params.gift_received.toString());
    }

    const query = queryParams.toString();
    const endpoint = query ? `/api/participants?${query}` : '/api/participants';

    return apiClient.get<ApiResponse<Participant[]>>(endpoint);
  },

  // 7. Get participant by ID with attendance records
  async getById(id: string): Promise<ApiResponse<Participant>> {
    return apiClient.get<ApiResponse<Participant>>(`/api/participants/${id}`);
  },

  // 8. Create new participant
  async create(data: CreateParticipantInput): Promise<ApiResponse<Participant>> {
    return apiClient.post<ApiResponse<Participant>>('/api/participants', data);
  },

  // 9. Update participant
  async update(id: string, data: UpdateParticipantInput): Promise<ApiResponse<Participant>> {
    return apiClient.patch<ApiResponse<Participant>>(`/api/participants/${id}`, data);
  },

  // 10. Delete participant
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/participants/${id}`);
  },

  // 16. Get participant statistics
  async getStats(id: string): Promise<ApiResponse<ParticipantDetailStats>> {
    return apiClient.get<ApiResponse<ParticipantDetailStats>>(`/api/participants/${id}/stats`);
  },
};
