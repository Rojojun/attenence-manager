import { apiClient } from '../api';
import type {
  ApiResponse,
  GiftEligibleParticipant,
  UpdateGiftStatusInput,
  GiftQueryParams,
} from '../types';

export const giftsService = {
  // 17. Get gift eligible participants
  async getEligible(params?: GiftQueryParams): Promise<ApiResponse<GiftEligibleParticipant[]>> {
    const queryParams = new URLSearchParams();

    if (params?.program_id) queryParams.append('program_id', params.program_id);
    if (params?.received !== undefined) {
      queryParams.append('received', params.received.toString());
    }

    const query = queryParams.toString();
    const endpoint = query ? `/api/gifts?${query}` : '/api/gifts';

    return apiClient.get<ApiResponse<GiftEligibleParticipant[]>>(endpoint);
  },

  // 18. Update gift received status
  async updateStatus(
    participantId: string,
    data: UpdateGiftStatusInput
  ): Promise<ApiResponse<{ participant_id: string; participant_name: string; gift_received: boolean; updated_at: string }>> {
    return apiClient.patch(`/api/gifts/${participantId}`, data);
  },
};
