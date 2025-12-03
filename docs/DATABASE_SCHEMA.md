# Supabase 데이터베이스 스키마 문서

이 문서는 ReWorkCare 프로젝트의 Supabase 데이터베이스 스키마를 설명합니다.

**최종 업데이트**: 2025-01-20

---

## 📋 목차

1. [테이블 목록](#테이블-목록)
2. [테이블 상세 정보](#테이블-상세-정보)
3. [인덱스 정보](#인덱스-정보)
4. [RLS (Row Level Security) 상태](#rls-상태)
5. [Storage 버킷](#storage-버킷)

---

## 테이블 목록

현재 데이터베이스에는 다음 7개의 주요 테이블이 있습니다:

| 테이블명 | 설명 | 주요 용도 |
|---------|------|----------|
| `users` | 사용자 정보 (Clerk 연동) | 인증된 사용자 정보 저장 |
| `hospitals_pharmacies` | 병원/약국 정보 캐시 | 산재 지정 의료기관 정보 |
| `rehabilitation_centers` | 재활기관 정보 | 산재 재활기관 정보 |
| `pharmacies` | 약국 정보 (별도 테이블) | 산재 지정 약국 상세 정보 |
| `favorites` | 즐겨찾기 | 사용자가 선택한 의료기관 |
| `document_summaries` | 서류 요약 캐시 | AI 생성 서류 요약 가이드 |
| `user_activity_logs` | 사용자 활동 로그 | 사용자 행동 패턴 분석 |

---

## 테이블 상세 정보

### 1. `users` 테이블

**용도**: Clerk 인증과 연동되는 사용자 정보를 저장합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 기본 키 |
| `clerk_id` | TEXT | NOT NULL, UNIQUE | Clerk 사용자 ID |
| `name` | TEXT | NOT NULL | 사용자 이름 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 생성 일시 |

**관계**:
- `favorites.user_id` → `users.id` (외래키)
- `user_activity_logs.user_id` → `users.id` (외래키, NULL 허용)

---

### 2. `hospitals_pharmacies` 테이블

**용도**: 산재 지정 의료기관(병원/약국) 정보를 캐시합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 기본 키 |
| `name` | TEXT | NOT NULL | 병원/약국명 |
| `type` | TEXT | NOT NULL, CHECK | 'hospital' 또는 'pharmacy' |
| `address` | TEXT | NOT NULL | 전체 주소 |
| `latitude` | DOUBLE PRECISION | NOT NULL | 위도 (WGS84) |
| `longitude` | DOUBLE PRECISION | NOT NULL | 경도 (WGS84) |
| `phone` | TEXT | NULL | 전화번호 |
| `department` | TEXT | NULL | 진료과목 (원본 데이터) |
| `institution_type` | TEXT | NULL | 기관 유형 (대학병원, 종합병원, 병원, 의원, 한의원, 요양병원, 기타) |
| `department_extracted` | TEXT | NULL | 추출된 진료과목 (여러 과목은 쉼표로 구분) |
| `last_updated` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 최종 업데이트 일시 |

**제약조건**:
- `valid_coordinates`: 위도는 -90~90, 경도는 -180~180 범위 내

**인덱스**:
- `idx_hospitals_pharmacies_location`: 공간 검색용 (GIST)
- `idx_hospitals_pharmacies_type`: 타입별 필터링
- `idx_hospitals_pharmacies_institution_type`: 기관 유형별 필터링
- `idx_hospitals_pharmacies_department_extracted`: 진료과목별 필터링
- `idx_hospitals_pharmacies_last_updated`: 최신순 정렬

---

### 3. `rehabilitation_centers` 테이블

**용도**: 산재 재활기관 정보를 저장합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 기본 키 |
| `gigwan_nm` | TEXT | NOT NULL | 기관명 |
| `gigwan_fg` | TEXT | NULL | 기관구분 코드 |
| `gigwan_fg_nm` | TEXT | NULL | 기관구분명 (직업훈련기관, 재활스포츠 위탁기관, 심리재활프로그램 위탁기관) |
| `address` | TEXT | NOT NULL | 주소 |
| `latitude` | DOUBLE PRECISION | NOT NULL, DEFAULT 0 | 위도 |
| `longitude` | DOUBLE PRECISION | NOT NULL, DEFAULT 0 | 경도 |
| `tel_no` | TEXT | NULL | 전화번호 |
| `fax_no` | TEXT | NULL | 팩스번호 |
| `gwanri_jisa_cd` | TEXT | NULL | 관리지사 코드 |
| `jisa_nm` | TEXT | NULL | 관리지사명 |
| `last_updated` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 최종 업데이트 일시 |

**제약조건**:
- `valid_coordinates`: 위도는 -90~90, 경도는 -180~180 범위 내

**인덱스**:
- `idx_rehabilitation_centers_location`: 공간 검색용 (GIST)
- `idx_rehabilitation_centers_gigwan_fg_nm`: 기관구분명별 필터링
- `idx_rehabilitation_centers_name`: 기관명 검색

---

### 4. `pharmacies` 테이블

**용도**: 산재 지정 약국 상세 정보를 저장합니다 (별도 테이블).

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 기본 키 |
| `hospital_nm` | TEXT | NOT NULL | 약국명 |
| `address` | TEXT | NOT NULL | 주소 |
| `latitude` | DOUBLE PRECISION | NOT NULL, DEFAULT 0 | 위도 (Geocoding 후 업데이트) |
| `longitude` | DOUBLE PRECISION | NOT NULL, DEFAULT 0 | 경도 (Geocoding 후 업데이트) |
| `tel` | TEXT | NULL | 전화번호 |
| `fax_tel` | TEXT | NULL | 팩스번호 |
| `gwanri_jisa_cd` | TEXT | NULL | 관리지사 코드 |
| `jisa_nm` | TEXT | NULL | 관리지사명 |
| `last_updated` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 최종 업데이트 일시 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 생성 일시 |

**제약조건**:
- `valid_coordinates`: 위도는 -90~90, 경도는 -180~180 범위 내
- `idx_pharmacies_unique`: 약국명 + 주소 조합이 유니크 (UNIQUE INDEX)

**인덱스**:
- `idx_pharmacies_hospital_nm`: 약국명 검색
- `idx_pharmacies_address`: 주소 검색
- `idx_pharmacies_gwanri_jisa_cd`: 관리지사 코드 검색
- `idx_pharmacies_location`: 공간 검색용 (GIST)

---

### 5. `favorites` 테이블

**용도**: 사용자가 선택한 의료기관을 즐겨찾기에 등록합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 기본 키 |
| `user_id` | UUID | NOT NULL, FK | 사용자 ID (users.id 참조) |
| `entity_type` | TEXT | NOT NULL, CHECK | 'hospital' 또는 'rehabilitation_center' |
| `entity_id` | UUID | NOT NULL | 의료기관 ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 생성 일시 |

**제약조건**:
- `unique_user_favorite`: 사용자는 같은 의료기관을 중복으로 즐겨찾기할 수 없음 (UNIQUE)

**관계**:
- `user_id` → `users.id` (ON DELETE CASCADE)

**인덱스**:
- `idx_favorites_user_id`: 사용자별 즐겨찾기 조회
- `idx_favorites_entity`: 의료기관별 즐겨찾기 조회
- `idx_favorites_created_at`: 최신순 정렬

---

### 6. `document_summaries` 테이블

**용도**: AI 생성 서류 요약 가이드를 캐싱합니다 (TTL: 7일).

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 기본 키 |
| `document_id` | TEXT | NOT NULL, UNIQUE | 서류 ID (예: "workplace-accident-application") |
| `summary` | TEXT | NOT NULL | 전체 요약 |
| `sections` | JSONB | NOT NULL, DEFAULT '[]' | 주요 항목별 작성 방법 (DocumentSection[]) |
| `important_notes` | TEXT[] | DEFAULT ARRAY[] | 주의사항 목록 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 생성 일시 |
| `expires_at` | TIMESTAMPTZ | NOT NULL | 만료 일시 (7일 후) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 최종 업데이트 일시 |

**인덱스**:
- `idx_document_summaries_document_id`: 서류 ID 검색
- `idx_document_summaries_created_at`: 생성일시 정렬
- `idx_document_summaries_expires_at`: 만료된 캐시 정리

**함수**:
- `cleanup_expired_document_summaries()`: 만료된 캐시 자동 삭제 함수

---

### 7. `user_activity_logs` 테이블

**용도**: 사용자 행동 패턴을 분석하기 위한 로그를 저장합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 기본 키 |
| `user_id` | UUID | NULL, FK | 사용자 ID (users.id 참조, NULL 허용) |
| `action` | TEXT | NOT NULL | 액션 유형 ('page_view', 'search', 'download', 'share' 등) |
| `timestamp` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 발생 일시 |
| `meta` | JSONB | NULL | 추가 메타데이터 (검색어, 클릭 항목, 위치 정보 등) |

**관계**:
- `user_id` → `users.id` (ON DELETE SET NULL)

**인덱스**:
- `idx_user_activity_logs_user_id`: 사용자별 로그 조회
- `idx_user_activity_logs_action`: 액션별 필터링
- `idx_user_activity_logs_timestamp`: 시간순 정렬
- `idx_user_activity_logs_meta`: JSONB 검색용 (GIN)

---

## 인덱스 정보

### 공간 검색 인덱스 (GIST)

다음 테이블들은 공간 검색을 위한 GIST 인덱스를 사용합니다:

- `hospitals_pharmacies`: `point(longitude, latitude)`
- `rehabilitation_centers`: `ll_to_earth(latitude, longitude)`
- `pharmacies`: `ll_to_earth(latitude, longitude)`

### 일반 인덱스

각 테이블의 주요 검색/필터링 컬럼에 인덱스가 생성되어 있습니다. 자세한 내용은 각 테이블 섹션을 참조하세요.

---

## RLS (Row Level Security) 상태

**현재 상태**: 모든 테이블에서 RLS가 **비활성화**되어 있습니다.

이는 개발 환경을 위한 설정이며, 프로덕션 배포 전에는 적절한 RLS 정책을 검토하고 적용해야 합니다.

### RLS 비활성화된 테이블

- `users`
- `hospitals_pharmacies`
- `rehabilitation_centers`
- `pharmacies`
- `favorites`
- `document_summaries`
- `user_activity_logs`

---

## Storage 버킷

### `uploads` 버킷

**용도**: 이미지 파일 저장용

**설정**:
- **Public**: `true` (누구나 접근 가능)
- **파일 크기 제한**: 50MB
- **허용 MIME 타입**: `image/*`
- **RLS 정책**: 모든 사용자에게 모든 작업 허용 (`all_user_crud`)

---

## 마이그레이션 파일 목록

| 파일명 | 설명 | 날짜 |
|--------|------|------|
| `setup_schema.sql` | 기본 스키마 설정 (users, hospitals_pharmacies, user_activity_logs) | 초기 |
| `20250114000000_create_rehabilitation_centers_table.sql` | 재활기관 테이블 생성 | 2025-01-14 |
| `20250114143000_add_institution_type_and_department.sql` | 기관 유형 및 진료과목 컬럼 추가 | 2025-01-14 |
| `20250114180000_create_document_summaries_table.sql` | 서류 요약 캐시 테이블 생성 | 2025-01-14 |
| `20250115120000_create_pharmacies_table.sql` | 약국 테이블 생성 | 2025-01-15 |
| `20250120120000_create_favorites_table.sql` | 즐겨찾기 테이블 생성 | 2025-01-20 |
| `setup_storage.sql` | Storage 버킷 설정 | 초기 |

---

## 데이터 통계 (예상)

> **참고**: 실제 데이터 개수는 `scripts/check-database-status.js` 스크립트를 실행하여 확인할 수 있습니다.

### 예상 데이터 규모

- **hospitals_pharmacies**: 수백 ~ 수천 개 (병원 + 약국)
- **rehabilitation_centers**: 수십 ~ 수백 개
- **pharmacies**: 수백 ~ 수천 개
- **users**: 로그인한 사용자 수에 따라 변동
- **favorites**: 사용자별 즐겨찾기 개수에 따라 변동
- **document_summaries**: 서류 종류에 따라 변동 (캐시 TTL: 7일)

---

## 주의사항

1. **RLS 비활성화**: 현재 모든 테이블에서 RLS가 비활성화되어 있습니다. 프로덕션 배포 전 반드시 검토하세요.

2. **Geocoding 상태**: 일부 테이블(`rehabilitation_centers`, `pharmacies`)의 경우 `latitude`와 `longitude`가 기본값 0으로 설정되어 있을 수 있습니다. Geocoding 완료 여부를 확인해야 합니다.

3. **데이터 중복**: `hospitals_pharmacies`와 `pharmacies` 테이블 모두 약국 정보를 포함할 수 있습니다. 데이터 일관성을 유지해야 합니다.

4. **외래키 관계**: `favorites` 테이블은 `users` 테이블과 `hospitals_pharmacies`/`rehabilitation_centers` 테이블을 참조하지만, 명시적인 외래키 제약조건은 `users`에만 설정되어 있습니다.

---

## 관련 문서

- [DATABASE_CHECK.md](./DATABASE_CHECK.md) - 데이터베이스 상태 확인 가이드
- [CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md) - CSV 데이터 임포트 가이드
- [GEOCODING_PROCESS.md](./GEOCODING_PROCESS.md) - Geocoding 프로세스 가이드



