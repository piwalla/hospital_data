# CSV 파일로 병원 데이터 가져오기 가이드

## 📋 CSV 파일 형식

`public` 폴더에 CSV 파일을 넣으면 자동으로 읽어서 Supabase에 저장합니다.

### 필수 컬럼
- `name`: 병원명 (필수)
- `address`: 주소 (필수)

### 선택 컬럼
- `type`: 'hospital' 또는 'pharmacy' (기본값: 'hospital')
- `phone`: 전화번호
- `department`: 진료과목

### CSV 예시

```csv
name,address,type,phone,department
서울대학교병원,서울특별시 종로구 대학로 101,hospital,02-2072-2114,정형외과
세브란스병원,서울특별시 서대문구 연세로 50-1,hospital,02-2228-5800,신경외과
강남약국,서울특별시 강남구 테헤란로 123,pharmacy,02-1234-5678,
```

## 🚀 사용 방법

### 1. CSV 파일 준비

1. 엑셀에서 데이터 정리
2. CSV 형식으로 저장 (UTF-8 인코딩 권장)
3. 파일명: `hospitals.csv` (또는 원하는 이름)
4. `public` 폴더에 저장

### 2. API 호출

브라우저에서 다음 URL을 열거나, 터미널에서 curl로 실행:

```bash
# 기본 (hospitals.csv 파일 사용)
POST http://localhost:3000/api/hospitals/import-csv

# 다른 파일명 사용
POST http://localhost:3000/api/hospitals/import-csv?filename=my-hospitals.csv

# Geocoding 딜레이 조정 (기본값: 150ms)
POST http://localhost:3000/api/hospitals/import-csv?filename=hospitals.csv&delayMs=100
```

### 3. curl 예시

```bash
curl -X POST "http://localhost:3000/api/hospitals/import-csv?filename=hospitals.csv"
```

## ⚙️ 동작 과정

1. **CSV 파일 읽기**: `public` 폴더에서 지정된 파일 읽기
2. **CSV 파싱**: 헤더를 기준으로 데이터 추출
3. **주소 중복 제거**: 같은 주소는 한 번만 Geocoding
4. **Geocoding**: 네이버 Maps API로 주소 → 좌표 변환
   - 각 주소당 약 150ms 소요 (API 부하 방지)
   - 네이버 Maps API 사용 (현재)
5. **Supabase 저장**: 
   - 중복 체크 (이름 + 주소)
   - 기존 데이터는 업데이트, 새 데이터는 삽입

## 📊 응답 예시

```json
{
  "success": true,
  "message": "CSV 파일에서 데이터를 성공적으로 가져왔습니다.",
  "summary": {
    "totalRows": 100,
    "savedCount": 95,
    "skippedCount": 3,
    "geocodingFailedCount": 2,
    "uniqueAddresses": 98
  }
}
```

## ⚠️ 주의사항

### 1. 파일 위치
- CSV 파일은 반드시 `public` 폴더에 있어야 합니다
- 파일명은 정확히 일치해야 합니다 (대소문자 구분)

### 2. Geocoding 시간
- 주소당 약 150ms 소요
- 100개 주소면 약 15초, 1000개면 약 2.5분 소요
- `delayMs` 파라미터로 조정 가능 (너무 작으면 API 제한에 걸릴 수 있음)

### 3. API 제한
- 네이버 Maps API의 일일 호출 제한 확인 필요
- 대량 데이터는 여러 번에 나눠서 처리 권장

### 4. 인코딩
- CSV 파일은 UTF-8 인코딩으로 저장 권장
- 한글이 깨지면 인코딩 문제일 수 있음

## 🔍 문제 해결

### 문제 1: 파일을 찾을 수 없음

```
CSV 파일을 읽을 수 없습니다: hospitals.csv
```

**해결**: 
- 파일이 `public` 폴더에 있는지 확인
- 파일명이 정확한지 확인 (확장자 포함)

### 문제 2: Geocoding 실패

**원인**: 
- 주소가 불명확하거나 잘못됨
- 네이버 Maps API 제한

**해결**:
- 주소를 더 구체적으로 작성 (예: "서울시 강남구" → "서울특별시 강남구 테헤란로 123")
- API 제한 확인

### 문제 3: 데이터가 저장되지 않음

**원인**:
- Supabase 연결 문제
- 데이터 형식 오류

**해결**:
- 서버 로그 확인
- 데이터 형식 확인 (type은 'hospital' 또는 'pharmacy'만 가능)

## 💡 팁

1. **작은 배치로 나눠서 처리**: 100-200개씩 나눠서 처리하면 안정적
2. **주소 정확성**: 주소가 정확할수록 Geocoding 성공률이 높음
3. **중복 제거**: CSV에서 중복된 주소를 미리 제거하면 시간 절약
4. **진행 상황 확인**: 서버 콘솔에서 로그 확인 가능

## 📝 CSV 템플릿

빈 템플릿:

```csv
name,address,type,phone,department
```

이 템플릿을 복사해서 엑셀에서 사용하세요!

