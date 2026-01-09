# RAG Document Registry

이 문서는 Google File Search Vector Store에 임베딩된 문서들의 이력을 관리합니다.
한글 파일명 오류를 방지하기 위해 업로드 시 영문명으로 변환된 내역과 원본 정보를 매핑하여 기록합니다.

## Vector Store Info

- **Display Name**: Hospital_Guide_Store_V3_Clean
- **Resource Name**: fileSearchStores/hospitalguidestorev3clean-5khogee4qpu6
- **Base Model**: gemini-2.5-flash

## Document List

| 추가 날짜 (Item Added) | 원본 파일명 (Original Name)                                      | 변환된 영문명 (ASCII Name)                                    | 상태 (Status) | 비고 (Description)                    |
| ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- | ------------- | ------------------------------------- |
| 2025-01-05             | 2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf | Hospital_Guide_2025.pdf                                       | Active        | 초기 데이터 구축 (2025 산재 가이드)   |
| 2025-01-05             | 장해진단서*작성원칙*및\_유의사항(근로복지공단).pdf               | Disability_Diagnosis_Guide.pdf                                | Active        | 장해 등급 판정 관련 의학적 가이드라인 |
| 2026-01-05             | [pdf]산업재해보상보험Ⅰ(업무상 재해).pdf                          | Industrial_Accident_Insurance_Criteria.pdf (DisplayName Only) | Active        | 업무상 재해 기준 (PDF)                |
| 2026-01-05             | 뇌혈관 질병...인정 여부 결정에 필요한 사항...pdf                 | Cardiovascular_and_Musculoskeletal_Diseases_Criteria.pdf      | Active        | 뇌혈관/심장/근골격계 판정 기준        |
| 2026-01-05             | 산업재해보상보험 요양급여 산정기준...pdf                         | Medical_Care_Benefit_Calculation_Standards.pdf                | Active        | 요양급여 산정 기준                    |
| 2026-01-05             | 산업재해보상보험법 시행규칙...pdf                                | Enforcement Rule of IACI Act                                  | Active        | 산재보험법 시행규칙                   |
| 2026-01-05             | 산업재해보상보험법 시행령...pdf                                  | Enforcement Decree of IACI Act                                | Active        | 산재보험법 시행령                     |
| 2026-01-05             | 산업재해보상보험법(법률)(제21065호)...pdf                        | IACI Act 21065 Current                                        | Active        | 산재보험법 (現행)                     |
| 2026-01-05             | 산업재해보상보험법(법률)(제21136호)...pdf                        | IACI Act 21136 Future                                         | Active        | 산재보험법 (예정)                     |
| 2026-01-05             | 산업재해보상보험법에 따른 간병료 지급기준...pdf                  | Nursing Care Benefit Payment Standards                        | Active        | 간병료 지급 기준                      |

## 관리 포인트 (Management Notes)

1. **파일명 변환**: Google File Search API는 비-ASCII 파일명을 지원하지 않으므로 반드시 영문/숫자로 변환 후 업로드해야 합니다.
2. **중복 관리**: 동일한 문서를 재업로드하지 않도록 이 대장을 먼저 확인하세요.
3. **업데이트**: 문서 내용이 변경된 경우, 기존 파일을 삭제(API 호출)하고 새로운 버전으로 재업로드해야 합니다.
