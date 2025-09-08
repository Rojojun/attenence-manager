export interface Program {
  id: string
  name: string
  description: string
  total_sessions: number
  start_date: string
  end_date: string
  created_at: string
}

export interface Participant {
  id: string
  program_id: string
  name: string
  email: string
  phone: string
  gift_received: boolean
  created_at: string
}

export interface AttendanceRecord {
  id: string
  participant_id: string
  program_id: string
  session_number: number
  signature_data: string
  attended_at: string
}

export const mockPrograms: Program[] = [
  {
    id: "1",
    name: "웹 개발 기초 과정",
    description: "HTML, CSS, JavaScript 기초부터 실습까지",
    total_sessions: 5,
    start_date: "2024-01-15",
    end_date: "2024-01-19",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "데이터 분석 워크샵",
    description: "Python을 활용한 데이터 분석 실무",
    total_sessions: 3,
    start_date: "2024-01-22",
    end_date: "2024-01-24",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "UI/UX 디자인 세미나",
    description: "사용자 중심의 디자인 사고와 실습",
    total_sessions: 4,
    start_date: "2024-01-29",
    end_date: "2024-02-01",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "모바일 앱 개발",
    description: "React Native를 활용한 크로스플랫폼 앱 개발",
    total_sessions: 6,
    start_date: "2024-02-05",
    end_date: "2024-02-10",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "클라우드 컴퓨팅 입문",
    description: "AWS 기초부터 배포까지",
    total_sessions: 4,
    start_date: "2024-02-12",
    end_date: "2024-02-15",
    created_at: "2024-01-01T00:00:00Z",
  },
]

export const mockParticipants: Participant[] = [
  // 웹 개발 기초 과정 참가자
  {
    id: "1",
    program_id: "1",
    name: "김민수",
    email: "minsu@example.com",
    phone: "010-1234-5678",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    program_id: "1",
    name: "이영희",
    email: "younghee@example.com",
    phone: "010-2345-6789",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    program_id: "1",
    name: "박철수",
    email: "chulsoo@example.com",
    phone: "010-3456-7890",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    program_id: "1",
    name: "정수진",
    email: "sujin@example.com",
    phone: "010-4567-8901",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    program_id: "1",
    name: "최동현",
    email: "donghyun@example.com",
    phone: "010-5678-9012",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    program_id: "1",
    name: "한소영",
    email: "soyoung@example.com",
    phone: "010-6789-0123",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },

  // 데이터 분석 워크샵 참가자
  {
    id: "7",
    program_id: "2",
    name: "강태우",
    email: "taewoo@example.com",
    phone: "010-7890-1234",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    program_id: "2",
    name: "윤지혜",
    email: "jihye@example.com",
    phone: "010-8901-2345",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "9",
    program_id: "2",
    name: "임현우",
    email: "hyunwoo@example.com",
    phone: "010-9012-3456",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "10",
    program_id: "2",
    name: "송미래",
    email: "mirae@example.com",
    phone: "010-0123-4567",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "11",
    program_id: "2",
    name: "조성민",
    email: "seongmin@example.com",
    phone: "010-1234-5679",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },

  // UI/UX 디자인 세미나 참가자
  {
    id: "12",
    program_id: "3",
    name: "배준호",
    email: "junho@example.com",
    phone: "010-2345-6780",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "13",
    program_id: "3",
    name: "신예린",
    email: "yerin@example.com",
    phone: "010-3456-7891",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "14",
    program_id: "3",
    name: "오건우",
    email: "gunwoo@example.com",
    phone: "010-4567-8902",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "15",
    program_id: "3",
    name: "홍다은",
    email: "daeun@example.com",
    phone: "010-5678-9013",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },

  // 모바일 앱 개발 참가자
  {
    id: "16",
    program_id: "4",
    name: "서지훈",
    email: "jihoon@example.com",
    phone: "010-6789-0124",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "17",
    program_id: "4",
    name: "김나연",
    email: "nayeon@example.com",
    phone: "010-7890-1235",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "18",
    program_id: "4",
    name: "이준석",
    email: "junseok@example.com",
    phone: "010-8901-2346",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "19",
    program_id: "4",
    name: "박하늘",
    email: "haneul@example.com",
    phone: "010-9012-3457",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "20",
    program_id: "4",
    name: "정우진",
    email: "woojin@example.com",
    phone: "010-0123-4568",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },

  // 클라우드 컴퓨팅 입문 참가자
  {
    id: "21",
    program_id: "5",
    name: "최예은",
    email: "yeeun@example.com",
    phone: "010-1234-5680",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "22",
    program_id: "5",
    name: "장민호",
    email: "minho@example.com",
    phone: "010-2345-6781",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "23",
    program_id: "5",
    name: "안수빈",
    email: "subin@example.com",
    phone: "010-3456-7892",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "24",
    program_id: "5",
    name: "황지원",
    email: "jiwon@example.com",
    phone: "010-4567-8903",
    gift_received: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "25",
    program_id: "5",
    name: "문성호",
    email: "seongho@example.com",
    phone: "010-5678-9014",
    gift_received: true,
    created_at: "2024-01-01T00:00:00Z",
  },
]

export const mockAttendance: AttendanceRecord[] = [
  // 웹 개발 기초 과정 출석 기록
  {
    id: "1",
    participant_id: "1",
    program_id: "1",
    session_number: 1,
    signature_data: "김민수_signature_1",
    attended_at: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    participant_id: "1",
    program_id: "1",
    session_number: 2,
    signature_data: "김민수_signature_2",
    attended_at: "2024-01-16T09:00:00Z",
  },
  {
    id: "3",
    participant_id: "2",
    program_id: "1",
    session_number: 1,
    signature_data: "이영희_signature_1",
    attended_at: "2024-01-15T09:05:00Z",
  },
  {
    id: "4",
    participant_id: "2",
    program_id: "1",
    session_number: 2,
    signature_data: "이영희_signature_2",
    attended_at: "2024-01-16T09:03:00Z",
  },
  {
    id: "5",
    participant_id: "2",
    program_id: "1",
    session_number: 3,
    signature_data: "이영희_signature_3",
    attended_at: "2024-01-17T09:02:00Z",
  },
  {
    id: "6",
    participant_id: "3",
    program_id: "1",
    session_number: 1,
    signature_data: "박철수_signature_1",
    attended_at: "2024-01-15T09:10:00Z",
  },

  // 데이터 분석 워크샵 출석 기록
  {
    id: "7",
    participant_id: "7",
    program_id: "2",
    session_number: 1,
    signature_data: "강태우_signature_1",
    attended_at: "2024-01-22T10:00:00Z",
  },
  {
    id: "8",
    participant_id: "8",
    program_id: "2",
    session_number: 1,
    signature_data: "윤지혜_signature_1",
    attended_at: "2024-01-22T10:05:00Z",
  },
  {
    id: "9",
    participant_id: "9",
    program_id: "2",
    session_number: 1,
    signature_data: "임현우_signature_1",
    attended_at: "2024-01-22T10:02:00Z",
  },
  {
    id: "10",
    participant_id: "9",
    program_id: "2",
    session_number: 2,
    signature_data: "임현우_signature_2",
    attended_at: "2024-01-23T10:00:00Z",
  },
]

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ATTENDANCE: "attendance_records",
  PARTICIPANTS: "participants_data",
  PROGRAMS: "programs_data",
}

// 로컬 스토리지 헬퍼 함수들
export function getStoredAttendance(): AttendanceRecord[] {
  if (typeof window === "undefined") return mockAttendance
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE)
  return stored ? JSON.parse(stored) : mockAttendance
}

export function saveAttendance(attendance: AttendanceRecord[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance))
}

export function addAttendanceRecord(record: Omit<AttendanceRecord, "id">): void {
  const currentRecords = getStoredAttendance()
  const newRecord: AttendanceRecord = {
    ...record,
    id: Date.now().toString(),
  }
  const updatedRecords = [...currentRecords, newRecord]
  saveAttendance(updatedRecords)
}

export function getStoredParticipants(): Participant[] {
  if (typeof window === "undefined") return mockParticipants
  const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS)
  return stored ? JSON.parse(stored) : mockParticipants
}

export function getStoredPrograms(): Program[] {
  if (typeof window === "undefined") return mockPrograms
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRAMS)
  return stored ? JSON.parse(stored) : mockPrograms
}

export const mockData = {
  programs: mockPrograms,
  participants: mockParticipants,
  attendance: mockAttendance,
}
