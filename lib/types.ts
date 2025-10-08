// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Program Types
export interface Program {
  id: string;
  name: string;
  description: string;
  total_sessions: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  participant_count?: number;
  total_attendance?: number;
  average_attendance_rate?: number;
}

export interface CreateProgramInput {
  name: string;
  description: string;
  total_sessions: number;
  start_date: string;
  end_date: string;
}

export interface UpdateProgramInput {
  name?: string;
  description?: string;
  total_sessions?: number;
  start_date?: string;
  end_date?: string;
}

// Participant Types
export interface Participant {
  id: string;
  program_id: string;
  name: string;
  email: string;
  phone: string;
  department?: string;
  position?: string;
  gift_received: boolean;
  created_at: string;
  updated_at: string;
  attendance?: AttendanceRecord[];
  attendance_count?: number;
  attendance_rate?: number;
}

export interface CreateParticipantInput {
  program_id: string;
  name: string;
  email: string;
  phone: string;
  department?: string;
  position?: string;
}

export interface UpdateParticipantInput {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  gift_received?: boolean;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  participant_id: string;
  program_id: string;
  session_number: number;
  signature_data?: string;
  attended_at: string;
  created_at: string;
}

export interface CreateAttendanceInput {
  participant_id: string;
  program_id: string;
  session_number: number;
  signature_data?: string;
}

export interface BulkAttendanceInput {
  participant_id: string;
  program_id: string;
  session_numbers: number[];
  signature_data?: string;
}

export interface BulkAttendanceResponse {
  created_count: number;
  records: AttendanceRecord[];
}

// Statistics Types
export interface SessionStats {
  session_number: number;
  attendance_count: number;
  attendance_rate: number;
}

export interface ParticipantStats {
  participant_id: string;
  participant_name: string;
  attendance_count: number;
  attendance_rate: number;
  gift_received: boolean;
}

export interface ProgramStats {
  program_id: string;
  program_name: string;
  total_sessions: number;
  total_participants: number;
  total_attendance_records: number;
  overall_attendance_rate: number;
  session_stats: SessionStats[];
  participant_stats: ParticipantStats[];
}

export interface ParticipantDetailStats {
  participant_id: string;
  participant_name: string;
  program_id: string;
  program_name: string;
  total_sessions: number;
  attended_sessions: number;
  attendance_rate: number;
  gift_received: boolean;
  attended_session_numbers: number[];
  missed_session_numbers: number[];
}

// Gift Types
export interface GiftEligibleParticipant {
  participant_id: string;
  participant_name: string;
  program_id: string;
  program_name: string;
  attendance_count: number;
  attendance_rate: number;
  gift_received: boolean;
  email: string;
  phone: string;
}

export interface UpdateGiftStatusInput {
  gift_received: boolean;
}

// Query Parameter Types
export interface ProgramQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'name' | 'start_date' | 'created_at';
  order?: 'asc' | 'desc';
}

export interface ParticipantQueryParams {
  page?: number;
  limit?: number;
  program_id?: string;
  search?: string;
  gift_received?: boolean;
}

export interface AttendanceQueryParams {
  program_id?: string;
  participant_id?: string;
  session_number?: number;
  start_date?: string;
  end_date?: string;
}

export interface GiftQueryParams {
  program_id?: string;
  received?: boolean;
}

export interface ExportQueryParams {
  format: 'excel' | 'pdf';
}
