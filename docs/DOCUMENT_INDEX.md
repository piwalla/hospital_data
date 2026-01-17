# 📚 ReworkCare 문서 인덱스 (Documentation Index)

이 문서는 프로젝트의 모든 문서들을 카테고리별로 정리하여 쉽게 찾아볼 수 있도록 돕는 네비게이션 페이지입니다.

## 💼 Handover & Retrospective (인수인계 및 회고)

> **[Final Doc]** 폴더에 정리된 최종 인수인계 자료입니다. (필독)

| 문서명                                                                   | 설명                                         |
| :----------------------------------------------------------------------- | :------------------------------------------- |
| **[👋 인수인계 가이드 메인](./프로젝트%20결산/인수인계_가이드_메인.md)** | **(가장 먼저 읽으세요)** 회고 문서 전체 목차 |
| [프로젝트 개요](./프로젝트%20결산/프로젝트_개요.md)                      | 프로젝트 소개 및 목적                        |
| [설치 가이드](./프로젝트%20결산/개발환경_설치_가이드.md)                 | 개발 환경 설정 방법                          |
| [프로젝트 구축 가이드](./프로젝트%20결산/프로젝트_구축_가이드.md)        | 아이디어부터 배포까지 전 과정 기록 (✨ New)  |
| **[비용 및 운영 한계](./프로젝트%20결산/비용_및_운영_한계.md)**          | 무료 플랜 주의사항 (✨ New)                  |
| **[서비스 계정 목록](./프로젝트%20결산/서비스_계정_목록.md)**            | 외부 계정 목록 (✨ New)                      |
| **[디자인 가이드](./프로젝트%20결산/디자인_및_브랜드_가이드.md)**        | 컬러/폰트/로고 정보 (✨ New)                 |
| **[퓨처 로드맵](./프로젝트%20결산/퓨처_로드맵.md)**                      | 향후 발전 아이디어 (✨ New)                  |
| [트러블슈팅 가이드](./프로젝트%20결산/트러블슈팅_가이드.md)              | 자주 발생하는 에러와 해결법                  |
| [AI 활용 가이드](./프로젝트%20결산/AI_활용_가이드.md)                    | 비개발자를 위한 AI 활용법                    |
| [기술 스택 및 아키텍처](./프로젝트%20결산/기술_스택_및_아키텍처.md)      | 사용 기술 및 시스템 구조                     |
| [데이터베이스 가이드](./프로젝트%20결산/데이터베이스_가이드.md)          | DB 스키마 및 관리                            |
| [주요 기능 가이드](./프로젝트%20결산/주요_기능_가이드.md)                | 핵심 기능 상세 설명                          |
| [배포 및 운영 가이드](./프로젝트%20결산/배포_및_운영_가이드.md)          | Vercel 배포 및 환경변수                      |
| [코드 구조 설명서](./프로젝트%20결산/코드_구조_설명서.md)                | 폴더 구조 및 주요 파일                       |
| [데이터 관리 가이드](./프로젝트%20결산/데이터_관리_가이드.md)            | 데이터 업로드 및 백업                        |

## 🚀 시작하기 & 필수 가이드

프로젝트를 처음 접하거나 전체적인 현황을 파악할 때 유용한 문서들입니다.

| 문서명                                   | 설명                                  |
| ---------------------------------------- | ------------------------------------- |
| [README.md](../README.md)                | 프로젝트 메인 소개, 설치 및 실행 방법 |
| [TODO.md](./TODO.md)                     | 전체 작업 진행 현황 및 할 일 목록     |
| [NEXT_STEPS.md](./NEXT_STEPS.md)         | 현재 시점의 즉각적인 다음 단계 작업   |
| [NEXT_WORK_PLAN.md](./NEXT_WORK_PLAN.md) | 중단기 작업 계획 및 우선순위          |
| [CHANGELOG.md](./CHANGELOG.md)           | 주요 변경 사항 기록                   |

## 🏗️ 기획 & 설계 (Planning & Design)

서비스의 목표, 요구사항, UI/UX 설계를 담은 문서들입니다.

| 문서명                                                                 | 설명                                |
| ---------------------------------------------------------------------- | ----------------------------------- |
| [PRD.md](./PRD.md)                                                     | 제품 요구사항 정의서 (구버전)       |
| [New PRD.md](./New%20PRD.md)                                           | 업데이트된 제품 요구사항 정의서     |
| [design.md](./design.md)                                               | 전체 디자인 시스템 및 스타일 가이드 |
| [design-overview-current.md](./design-overview-current.md)             | 현재 구현된 디자인 현황 요약        |
| [flow_page.md](./flow_page.md)                                         | 주요 페이지별 화면 흐름도           |
| [HEADER_DESIGN_IMPROVEMENT.md](./HEADER_DESIGN_IMPROVEMENT.md)         | 헤더 디자인 개선안                  |
| [NAVIGATION_DESIGN_IMPROVEMENT.md](./NAVIGATION_DESIGN_IMPROVEMENT.md) | 네비게이션 구조 개선안              |

## 💾 데이터베이스 (Database)

Supabase 스키마, 보안 정책, 데이터 구조 관련 문서입니다.

| 문서명                                                 | 설명                                     |
| ------------------------------------------------------ | ---------------------------------------- |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)             | 전체 데이터베이스 테이블 스키마 상세     |
| [database_rls_security.md](./database_rls_security.md) | RLS(Row Level Security) 보안 정책 가이드 |
| [DATABASE_CHECK.md](./DATABASE_CHECK.md)               | 데이터베이스 무결성 점검 리포트          |

## 🤖 AI 챗봇 & RAG (AI & Chatbot)

Google Gemini 기반의 RAG 챗봇 구현 및 운영 가이드입니다.

| 문서명                                                                         | 설명                                  |
| ------------------------------------------------------------------------------ | ------------------------------------- |
| [CHATBOT_PRODUCTION_GUIDE.md](./CHATBOT_PRODUCTION_GUIDE.md)                   | **★ 핵심** 챗봇 배포 및 운영 가이드   |
| [rag_document_registry.md](./rag_document_registry.md)                         | RAG에 등록된 학습 문서 목록           |
| [google_file_search_implementation.md](./google_file_search_implementation.md) | Google File Search API 구현 상세      |
| [chatbot_architecture.md](./chatbot_architecture.md)                           | 챗봇 시스템 아키텍처 구조도           |
| [N8N_RAG_CHATBOT_WORKFLOW.md](./N8N_RAG_CHATBOT_WORKFLOW.md)                   | n8n을 이용한 챗봇 워크플로우 (참고용) |

## 🗺️ 지도 & 위치 서비스 (Maps & Geo)

병원 및 약국 찾기 기능을 위한 지도 API 및 지오코딩 관련 문서입니다.

| 문서명                                                     | 설명                                     |
| ---------------------------------------------------------- | ---------------------------------------- |
| [naver-maps-api.md](./naver-maps-api.md)                   | 네이버 지도 API 연동 가이드              |
| [GEOCODING_PROCESS.md](./GEOCODING_PROCESS.md)             | 주소를 좌표로 변환하는 지오코딩 프로세스 |
| [REGION_FILTER_PLAN.md](./REGION_FILTER_PLAN.md)           | 지역별 필터링 기능 구현 계획             |
| [PHARMACY_GEOCODING_PLAN.md](./PHARMACY_GEOCODING_PLAN.md) | 약국 데이터 지오코딩 계획                |

## 📊 데이터 관리 (Data)

데이터 수집(크롤링), 임포트, 관리에 대한 내용입니다.

| 문서명                                                   | 설명                               |
| -------------------------------------------------------- | ---------------------------------- |
| [CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)             | 병원/약국 데이터 CSV 임포트 가이드 |
| [PHARMACY_CRAWLING_PLAN.md](./PHARMACY_CRAWLING_PLAN.md) | 약국 정보 크롤링 계획              |
| [failed_hospitals_list.md](./failed_hospitals_list.md)   | 지오코딩/임포트 실패한 병원 목록   |

## 📝 산재 서류 가이드 (Compensation Docs)

각 산재 신청 서류에 대한 상세 가이드 내용입니다.

- [compensation_guide_research.md](./compensation_guide_research.md): 산재 보상 가이드 리서치 통합
- [산재신청서.md](./산재신청서.md)
- [요양비청구서.md](./요양비청구서.md)
- [휴업급여청구서.md](./휴업급여청구서.md)
- [장해급여청구서.md](./장해급여청구서.md)
- [간병급여 청구서.md](./간병급여%20청구서.md)
- [그 외 서류 가이드들...]

## 🔍 테스트 및 검증 (QA)

| 문서명                               | 설명                  |
| ------------------------------------ | --------------------- |
| [TEST_GUIDE.md](./TEST_GUIDE.md)     | 테스트 가이드라인     |
| [TEST_RESULTS.md](./TEST_RESULTS.md) | 테스트 수행 결과 기록 |

## 📦 기타 & 레거시

| 문서명                             | 설명                         |
| ---------------------------------- | ---------------------------- |
| [DIR.md](./DIR.md)                 | 전체 디렉토리 트리 구조      |
| [api-data-kr.md](./api-data-kr.md) | 공공데이터 API 분석 (참고용) |
