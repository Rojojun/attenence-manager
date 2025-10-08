import { apiClient } from '../api';
import type {
  ApiResponse,
  AttendanceRecord,
  CreateAttendanceInput,
  BulkAttendanceInput,
  BulkAttendanceResponse,
  AttendanceQueryParams,
} from '../types';

export const attendanceService = {
  // 11. Get attendance records with filtering
  async getAll(params?: AttendanceQueryParams): Promise<ApiResponse<AttendanceRecord[]>> {
    const queryParams = new URLSearchParams();

    if (params?.program_id) queryParams.append('program_id', params.program_id);
    if (params?.participant_id) queryParams.append('participant_id', params.participant_id);
    if (params?.session_number) queryParams.append('session_number', params.session_number.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const query = queryParams.toString();
    const endpoint = query ? `/api/attendance?${query}` : '/api/attendance';

    return apiClient.get<ApiResponse<AttendanceRecord[]>>(endpoint);
  },

  // 12. Create single attendance record
  async create(data: CreateAttendanceInput): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.post<ApiResponse<AttendanceRecord>>('/api/attendance', data);
  },

  // 13. Create bulk attendance records
  async createBulk(data: BulkAttendanceInput): Promise<ApiResponse<BulkAttendanceResponse>> {
    return apiClient.post<ApiResponse<BulkAttendanceResponse>>('/api/attendance/bulk', data);
  },

  // 14. Delete attendance record
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/attendance/${id}`);
  },
};
