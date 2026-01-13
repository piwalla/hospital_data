# 데이터베이스 RLS (Row Level Security) 보안 설정 문서

이 문서는 Supabase 데이터베이스의 모든 테이블(25개)에 적용된 **보안 정책(RLS)**의 현황과 설정 배경을 정리한 문서입니다.

## 🛡️ 보안 모델 개요

데이터베이스 테이블은 데이터의 성격에 따라 4가지 보안 등급으로 분류되어 관리됩니다.

| 보안 등급                        | 설명                                                                                               | 대상 테이블 예시                             |
| :------------------------------- | :------------------------------------------------------------------------------------------------- | :------------------------------------------- |
| **🔒 개인 정보 (Private)**       | 로그인한 **본인만** 자신의 데이터를 조회/수정할 수 있습니다. 타인의 접근은 엄격히 차단됩니다.      | `users`, `favorites`, `user_profiles`        |
| **👥 커뮤니티 (Community)**      | **누구나 조회** 가능하지만, 생성/수정/삭제는 **작성자 본인만** 가능합니다.                         | `community_posts`, `community_comments`      |
| **📖 공공 데이터 (Public Read)** | **누구나 조회** 가능하지만, 데이터의 수정은 **관리자(Service Role)만** 가능합니다.                 | `hospitals_pharmacies`, `timeline_documents` |
| **🚫 잠금 (Locked)**             | 현재 사용되지 않거나 테스트용 테이블로, **모든 외부 접근이 차단**됩니다. 관리자만 접근 가능합니다. | `documents1`, `rag_hospital*`                |

---

## 1. 🔒 개인 정보 (Private User Data)

_가장 높은 수준의 보안이 요구되는 사용자 개인 데이터입니다._

### `users` (사용자 기본 정보)

- **성격**: Clerk 인증 정보와 매핑되는 사용자 핵심 테이블
- **정책**:
  - **SELECT/UPDATE**: `clerk_id`가 현재 로그인한 사용자의 ID와 일치하는 행만 허용.
  - **INSERT**: (Service Role을 통해 가입 시 자동 생성되므로 일반 접근 불필요)

### `user_profiles` (사용자 프로필)

- **성격**: 사용자의 부가 정보 (닉네임 등)
- **정책**:
  - **SELECT/UPDATE/INSERT**: 본인의 ID(`sub`)와 일치하는 프로필만 허용.

### `favorites` (즐겨찾기)

- **성격**: 사용자가 저장한 병원/약국 목록
- **정책**:
  - **ALL (CRUD)**: `user_id`가 본인의 계정과 연결된 데이터만 허용.

### `user_activity_logs` (활동 로그)

- **성격**: 사용자 행동 기록
- **정책**:
  - **INSERT**: 로그인한 사용자는 자신의 로그를 생성할 수 있음.
  - **SELECT**: 일반 사용자는 조회 불가 (관리자만 조회 가능).

### `messages`, `cs_messages`, `cs_sessions` (CS 채팅)

- **성격**: 1:1 고객 상담 내역
- **정책**:
  - **SELECT/INSERT**: 해당 세션의 소유자(본인)만 접근 가능.

---

## 2. 👥 커뮤니티 기능 (Community Features)

_사용자 간 소통을 위한 데이터로, 조회는 개방하고 쓰기는 본인 인증이 필요합니다._

### `community_posts`, `posts` (게시글)

- **성격**: 커뮤니티 게시글
- **정책**:
  - **SELECT**: 누구나 조회 가능 (삭제되지 않은 글).
  - **INSERT**: 로그인한 사용자만 작성 가능.
  - **UPDATE/DELETE**: 작성자 본인만 가능.

### `community_comments` (댓글)

- **성격**: 게시글에 달린 댓글
- **정책**:
  - **SELECT**: 누구나 조회 가능.
  - **INSERT**: 로그인한 사용자만 작성 가능.
  - **UPDATE/DELETE**: 작성자 본인만 가능.

### `community_likes` (좋아요)

- **성격**: 게시글/댓글 좋아요 상태
- **정책**:
  - **SELECT**: 누구나 조회 가능.
  - **INSERT/DELETE**: 본인의 좋아요만 제어 가능.

---

## 3. 📖 공공/참조 데이터 (Public Read-Only)

_앱 서비스의 기초 데이터로, 사용자는 수정 권한 없이 조회만 가능합니다._

### 병원 및 의료 기관 데이터

- **대상**: `hospitals_pharmacies` (병원/약국), `rehabilitation_centers` (재활센터)
- **정책**:
  - **SELECT**: **누구나 허용** (`TO public`).
  - **WRITE**: 차단 (관리자 전용).

### 타임라인 및 가이드 정보

- **대상**:
  - `stages` (산재 처리 단계)
  - `timeline_documents` (필요 서류 안내)
  - `timeline_warnings` (주의사항)
  - `timeline_actions` (행동 가이드)
  - `industrial_accident_stats` (산재 통계)
  - `document_summaries` (문서 요약)
  - `rag_documents` (RAG 검색용 문서 메타데이터)
- **정책**:
  - **SELECT**: **누구나 허용** (`TO public`).
  - **WRITE**: 차단 (관리자 전용).

---

## 4. 🚫 잠금/미사용 (Locked / Unused)

_현재 서비스 코드에서 참조되지 않거나 테스트 잔여 데이터입니다. 안전을 위해 RLS를 켜고 정책을 비워두어 접근을 원천 차단했습니다._

### 대상 테이블

- `documents` (View - `rag_hospital_gemini`를 참조)
- `documents1` (벡터 스토어 테스트용 - 비어 있음)
- `rag_hospital`
- `rag_hospital1`
- `rag_hospital_gemini`

### 정책 설정

- **RLS Enabled**: ✅ 켜짐 (View인 `documents`는 원본 테이블의 RLS를 따름)
- **Policies**: 없음 (No policies)
- **결과**: Service Role(관리자/서버)을 제외한 모든 접근 거부.
  - _(참고: Supabase 대시보드에서 `documents`가 View이기 때문에 `Unrestricted`로 표시될 수 있으나, 원본인 `rag_hospital_gemini`가 잠겨있으므로 실제로 데이터 조회는 불가능합니다.)_

---

## 📝 참고 사항 (Implementation Plan v9 반영)

- **가독성**: 텍스트 스타일 상향 표준화 계획에 따라, 본 문서도 명확한 헤더와 아이콘을 사용하여 가독성을 높였습니다.
- **검증**: 위 정책들은 `pg_policies` 조회를 통해 시스템적으로 검증되었으며, 실제 앱 사용 시나리오(로그인/비로그인, 본인/타인)를 통해 2차 검증을 마쳤습니다.
