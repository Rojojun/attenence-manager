## 기본 URL
```
http://localhost:3000/api
```

## 응답 형식

모든 API 응답은 다음 구조를 따릅니다:

```typescript
{
  "success": boolean,
  "data": any,           // 성공 시 포함
  "error": {             // 오류 시 포함
    "code": string,
    "message": string,
    "details": any
  },
  "meta": {              // 페이지네이션 응답 시 포함
    "page": number,
    "limit": number,
    "total": number
  }
}
```

## 상태 코드

- `200 OK` - GET, PUT, PATCH 요청 성공
- `201 Created` - POST 요청 성공
- `204 No Content` - DELETE 요청 성공
- `400 Bad Request` - 유효성 검증 오류 또는 잘못된 요청
- `404 Not Found` - 리소스를 찾을 수 없음
- `500 Internal Server Error` - 서버 오류

---

# 프로그램 API

## 1. 전체 프로그램 조회

필터링 및 페이지네이션이 가능한 프로그램 목록을 조회합니다.

**엔드포인트:** `GET /api/programs`

**쿼리 파라미터:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| page | number | 아니오 | 페이지 번호 (기본값: 1) |
| limit | number | 아니오 | 페이지당 항목 수 (기본값: 10) |
| search | string | 아니오 | 프로그램 이름으로 검색 |
| sort | string | 아니오 | 정렬 필드: `name`, `start_date`, `created_at` (기본값: `created_at`) |
| order | string | 아니오 | 정렬 순서: `asc`, `desc` (기본값: `desc`) |

**요청 예시:**
```bash
GET /api/programs?page=1&limit=10&search=웹개발&sort=start_date&order=desc
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "웹 개발 기초 과정",
      "description": "HTML, CSS, JavaScript 기초부터 실습까지",
      "total_sessions": 5,
      "start_date": "2024-01-15T00:00:00Z",
      "end_date": "2024-01-19T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "participant_count": 15,
      "total_attendance": 68,
      "average_attendance_rate": 90.67
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

## 2. 프로그램 상세 조회

특정 프로그램의 상세 정보를 조회합니다.

**엔드포인트:** `GET /api/programs/:id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 프로그램 UUID |

**요청 예시:**
```bash
GET /api/programs/550e8400-e29b-41d4-a716-446655440000
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "웹 개발 기초 과정",
    "description": "HTML, CSS, JavaScript 기초부터 실습까지",
    "total_sessions": 5,
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": "2024-01-19T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "participant_count": 15,
    "total_attendance": 68,
    "average_attendance_rate": 90.67
  }
}
```

**오류 응답 (404):**
```json
{
  "success": false,
  "error": {
    "code": "PROGRAM_NOT_FOUND",
    "message": "프로그램을 찾을 수 없습니다"
  }
}
```

---

## 3. 프로그램 생성

새로운 프로그램을 생성합니다.

**엔드포인트:** `POST /api/programs`

**요청 본문:**
```json
{
  "name": "웹 개발 기초 과정",
  "description": "HTML, CSS, JavaScript 기초부터 실습까지",
  "total_sessions": 5,
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-19T00:00:00Z"
}
```

**유효성 검증 규칙:**

- `name`: 필수, 1-100자
- `description`: 필수, 1-500자
- `total_sessions`: 필수, 정수, 1-100
- `start_date`: 필수, ISO 8601 날짜/시간 형식
- `end_date`: 필수, ISO 8601 날짜/시간 형식

**응답 예시 (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "웹 개발 기초 과정",
    "description": "HTML, CSS, JavaScript 기초부터 실습까지",
    "total_sessions": 5,
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": "2024-01-19T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**오류 응답 (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터가 유효하지 않습니다",
    "details": {
      "name": ["프로그램 이름은 필수입니다"],
      "total_sessions": ["최소 1교시 이상이어야 합니다"]
    }
  }
}
```

---

## 4. 프로그램 수정

기존 프로그램을 수정합니다.

**엔드포인트:** `PATCH /api/programs/:id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 프로그램 UUID |

**요청 본문 (모든 필드 선택 사항):**
```json
{
  "name": "웹 개발 심화 과정",
  "description": "React, Node.js를 활용한 풀스택 개발",
  "total_sessions": 10,
  "start_date": "2024-02-01T00:00:00Z",
  "end_date": "2024-02-10T00:00:00Z"
}
```

**응답 예시 (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "웹 개발 심화 과정",
    "description": "React, Node.js를 활용한 풀스택 개발",
    "total_sessions": 10,
    "start_date": "2024-02-01T00:00:00Z",
    "end_date": "2024-02-10T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## 5. 프로그램 삭제

프로그램과 관련된 모든 참가자 및 출석 기록을 삭제합니다.

**엔드포인트:** `DELETE /api/programs/:id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 프로그램 UUID |

**요청 예시:**
```bash
DELETE /api/programs/550e8400-e29b-41d4-a716-446655440000
```

**응답 예시 (204):**
```
내용 없음
```

---

# 참가자 API

## 6. 전체 참가자 조회

필터링이 가능한 참가자 목록을 조회합니다.

**엔드포인트:** `GET /api/participants`

**쿼리 파라미터:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| page | number | 아니오 | 페이지 번호 (기본값: 1) |
| limit | number | 아니오 | 페이지당 항목 수 (기본값: 20) |
| program_id | string | 아니오 | 프로그램 UUID로 필터링 |
| search | string | 아니오 | 이름 또는 이메일로 검색 |
| gift_received | boolean | 아니오 | 기념품 수령 상태로 필터링 |

**요청 예시:**
```bash
GET /api/participants?program_id=550e8400-e29b-41d4-a716-446655440000&gift_received=false
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "program_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "김민수",
      "email": "minsu@example.com",
      "phone": "010-1234-5678",
      "department": "개발팀",
      "position": "주니어 개발자",
      "gift_received": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

---

## 7. 참가자 상세 조회

출석 기록을 포함한 특정 참가자의 상세 정보를 조회합니다.

**엔드포인트:** `GET /api/participants/:id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 참가자 UUID |

**요청 예시:**
```bash
GET /api/participants/660e8400-e29b-41d4-a716-446655440001
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "program_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "김민수",
    "email": "minsu@example.com",
    "phone": "010-1234-5678",
    "department": "개발팀",
    "position": "주니어 개발자",
    "gift_received": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "attendance": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "participant_id": "660e8400-e29b-41d4-a716-446655440001",
        "program_id": "550e8400-e29b-41d4-a716-446655440000",
        "session_number": 1,
        "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
        "attended_at": "2024-01-15T09:00:00Z",
        "created_at": "2024-01-15T09:00:00Z"
      }
    ],
    "attendance_count": 4,
    "attendance_rate": 80.0
  }
}
```

---

## 8. 참가자 생성

프로그램에 새로운 참가자를 생성합니다.

**엔드포인트:** `POST /api/participants`

**요청 본문:**
```json
{
  "program_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "김민수",
  "email": "minsu@example.com",
  "phone": "010-1234-5678",
  "department": "개발팀",
  "position": "주니어 개발자"
}
```

**유효성 검증 규칙:**

- `program_id`: 필수, 유효한 UUID
- `name`: 필수, 1-50자
- `email`: 필수, 유효한 이메일 형식
- `phone`: 필수, 형식: `010-XXXX-XXXX`
- `department`: 선택, 최대 50자
- `position`: 선택, 최대 50자

**응답 예시 (201):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "program_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "김민수",
    "email": "minsu@example.com",
    "phone": "010-1234-5678",
    "department": "개발팀",
    "position": "주니어 개발자",
    "gift_received": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## 9. 참가자 수정

기존 참가자 정보를 수정합니다.

**엔드포인트:** `PATCH /api/participants/:id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 참가자 UUID |

**요청 본문 (모든 필드 선택 사항):**
```json
{
  "name": "김민수",
  "email": "minsu.kim@example.com",
  "phone": "010-9876-5432",
  "department": "프론트엔드팀",
  "position": "시니어 개발자",
  "gift_received": true
}
```

**응답 예시 (200):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "program_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "김민수",
    "email": "minsu.kim@example.com",
    "phone": "010-9876-5432",
    "department": "프론트엔드팀",
    "position": "시니어 개발자",
    "gift_received": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  }
}
```

---

## 10. 참가자 삭제

참가자와 관련된 모든 출석 기록을 삭제합니다.

**엔드포인트:** `DELETE /api/participants/:id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 참가자 UUID |

**응답 예시 (204):**
```
내용 없음
```

---

# 출석 API

## 11. 출석 기록 조회

필터링이 가능한 출석 기록을 조회합니다.

**엔드포인트:** `GET /api/attendance`

**쿼리 파라미터:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| program_id | string | 아니오 | 프로그램 UUID로 필터링 |
| participant_id | string | 아니오 | 참가자 UUID로 필터링 |
| session_number | number | 아니오 | 세션 번호로 필터링 |
| start_date | string | 아니오 | 시작 날짜부터 필터링 (ISO 8601) |
| end_date | string | 아니오 | 종료 날짜까지 필터링 (ISO 8601) |

**요청 예시:**
```bash
GET /api/attendance?program_id=550e8400-e29b-41d4-a716-446655440000&session_number=1
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "participant_id": "660e8400-e29b-41d4-a716-446655440001",
      "program_id": "550e8400-e29b-41d4-a716-446655440000",
      "session_number": 1,
      "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
      "attended_at": "2024-01-15T09:00:00Z",
      "created_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

---

## 12. 출석 기록 생성

단일 출석 기록을 생성합니다.

**엔드포인트:** `POST /api/attendance`

**요청 본문:**
```json
{
  "participant_id": "660e8400-e29b-41d4-a716-446655440001",
  "program_id": "550e8400-e29b-41d4-a716-446655440000",
  "session_number": 1,
  "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
}
```

**유효성 검증 규칙:**

- `participant_id`: 필수, 유효한 UUID
- `program_id`: 필수, 유효한 UUID
- `session_number`: 필수, 정수 >= 1
- `signature_data`: 선택, base64 이미지 문자열

**응답 예시 (201):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "participant_id": "660e8400-e29b-41d4-a716-446655440001",
    "program_id": "550e8400-e29b-41d4-a716-446655440000",
    "session_number": 1,
    "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
    "attended_at": "2024-01-15T09:00:00Z",
    "created_at": "2024-01-15T09:00:00Z"
  }
}
```

**오류 응답 (400):**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ATTENDANCE",
    "message": "이미 해당 세션에 출석 기록이 존재합니다"
  }
}
```

---

## 13. 일괄 출석 기록 생성

여러 출석 기록을 한 번에 생성합니다.

**엔드포인트:** `POST /api/attendance/bulk`

**요청 본문:**
```json
{
  "participant_id": "660e8400-e29b-41d4-a716-446655440001",
  "program_id": "550e8400-e29b-41d4-a716-446655440000",
  "session_numbers": [1, 2, 3, 4, 5],
  "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
}
```

**유효성 검증 규칙:**

- `participant_id`: 필수, 유효한 UUID
- `program_id`: 필수, 유효한 UUID
- `session_numbers`: 필수, 정수 배열 >= 1
- `signature_data`: 선택, base64 이미지 문자열

**응답 예시 (201):**
```json
{
  "success": true,
  "data": {
    "created_count": 5,
    "records": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "participant_id": "660e8400-e29b-41d4-a716-446655440001",
        "program_id": "550e8400-e29b-41d4-a716-446655440000",
        "session_number": 1,
        "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
        "attended_at": "2024-01-15T09:00:00Z",
        "created_at": "2024-01-15T09:00:00Z"
      }
      // ... 더 많은 기록
    ]
  }
}
```

---

## 14. 출석 기록 삭제

특정 출석 기록을 삭제합니다.

**엔드포인트:** `DELETE /api/attendance/:id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 출석 기록 UUID |

**응답 예시 (204):**
```
내용 없음
```

---

# 통계 및 보고서 API

## 15. 프로그램 통계 조회

특정 프로그램의 상세 통계를 조회합니다.

**엔드포인트:** `GET /api/programs/:id/stats`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 프로그램 UUID |

**요청 예시:**
```bash
GET /api/programs/550e8400-e29b-41d4-a716-446655440000/stats
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "program_id": "550e8400-e29b-41d4-a716-446655440000",
    "program_name": "웹 개발 기초 과정",
    "total_sessions": 5,
    "total_participants": 15,
    "total_attendance_records": 68,
    "overall_attendance_rate": 90.67,
    "session_stats": [
      {
        "session_number": 1,
        "attendance_count": 15,
        "attendance_rate": 100.0
      },
      {
        "session_number": 2,
        "attendance_count": 14,
        "attendance_rate": 93.33
      },
      {
        "session_number": 3,
        "attendance_count": 13,
        "attendance_rate": 86.67
      },
      {
        "session_number": 4,
        "attendance_count": 13,
        "attendance_rate": 86.67
      },
      {
        "session_number": 5,
        "attendance_count": 13,
        "attendance_rate": 86.67
      }
    ],
    "participant_stats": [
      {
        "participant_id": "660e8400-e29b-41d4-a716-446655440001",
        "participant_name": "김민수",
        "attendance_count": 5,
        "attendance_rate": 100.0,
        "gift_received": true
      }
      // ... 더 많은 참가자
    ]
  }
}
```

---

## 16. 참가자 통계 조회

특정 참가자의 출석 통계를 조회합니다.

**엔드포인트:** `GET /api/participants/:id/stats`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | string | 예 | 참가자 UUID |

**요청 예시:**
```bash
GET /api/participants/660e8400-e29b-41d4-a716-446655440001/stats
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "participant_id": "660e8400-e29b-41d4-a716-446655440001",
    "participant_name": "김민수",
    "program_id": "550e8400-e29b-41d4-a716-446655440000",
    "program_name": "웹 개발 기초 과정",
    "total_sessions": 5,
    "attended_sessions": 4,
    "attendance_rate": 80.0,
    "gift_received": false,
    "attended_session_numbers": [1, 2, 3, 5],
    "missed_session_numbers": [4]
  }
}
```

---

## 17. 기념품 수령 대상자 조회

기념품 수령 자격이 있는 참가자(출석률 >= 80%) 목록을 조회합니다.

**엔드포인트:** `GET /api/gifts`

**쿼리 파라미터:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| program_id | string | 아니오 | 프로그램 UUID로 필터링 |
| received | boolean | 아니오 | 기념품 수령 상태로 필터링 |

**요청 예시:**
```bash
GET /api/gifts?program_id=550e8400-e29b-41d4-a716-446655440000&received=false
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "participant_id": "660e8400-e29b-41d4-a716-446655440001",
      "participant_name": "김민수",
      "program_id": "550e8400-e29b-41d4-a716-446655440000",
      "program_name": "웹 개발 기초 과정",
      "attendance_count": 5,
      "attendance_rate": 100.0,
      "gift_received": false,
      "email": "minsu@example.com",
      "phone": "010-1234-5678"
    }
  ]
}
```

---

## 18. 기념품 수령 상태 업데이트

참가자의 기념품 수령 여부를 업데이트합니다.

**엔드포인트:** `PATCH /api/gifts/:participant_id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| participant_id | string | 예 | 참가자 UUID |

**요청 본문:**
```json
{
  "gift_received": true
}
```

**응답 예시 (200):**
```json
{
  "success": true,
  "data": {
    "participant_id": "660e8400-e29b-41d4-a716-446655440001",
    "participant_name": "김민수",
    "gift_received": true,
    "updated_at": "2024-01-20T15:00:00Z"
  }
}
```

---

# 내보내기 API

## 19. 프로그램 데이터 내보내기

프로그램 데이터를 Excel 또는 PDF 형식으로 내보냅니다.

**엔드포인트:** `GET /api/export/:program_id`

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| program_id | string | 예 | 프로그램 UUID |

**쿼리 파라미터:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| format | string | 예 | 내보내기 형식: `excel` 또는 `pdf` |

**요청 예시:**
```bash
GET /api/export/550e8400-e29b-41d4-a716-446655440000?format=excel
```

**응답:**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel)
- Content-Type: `application/pdf` (PDF)
- 바이너리 파일 다운로드

---

## 오류 코드 참조

| 코드 | HTTP 상태 | 설명 |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | 요청 유효성 검증 실패 |
| PROGRAM_NOT_FOUND | 404 | 프로그램을 찾을 수 없음 |
| PARTICIPANT_NOT_FOUND | 404 | 참가자를 찾을 수 없음 |
| ATTENDANCE_NOT_FOUND | 404 | 출석 기록을 찾을 수 없음 |
| DUPLICATE_ATTENDANCE | 400 | 해당 세션에 이미 출석 기록 존재 |
| INVALID_SESSION_NUMBER | 400 | 세션 번호가 프로그램의 총 세션 수를 초과함 |
| INTERNAL_ERROR | 500 | 내부 서버 오류 |

---

## 속도 제한

현재 속도 제한이 구현되어 있지 않습니다. 프로덕션 환경에서는 속도 제한 추가를 고려하세요:

- 권장: IP당 분당 100개 요청
- `express-rate-limit` 또는 Next.js 미들웨어 같은 라이브러리 사용

---

## 인증

현재 인증이 구현되어 있지 않습니다. 프로덕션 환경에서는 다음을 고려하세요:

- JWT 토큰
- API 키
- OAuth 2.0
- 역할 기반 접근 제어 (관리자 vs. 사용자)

---

## CORS 설정

프로덕션 환경을 위한 CORS 헤더 설정:

```typescript
// API 라우트에 추가
headers: {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}
```