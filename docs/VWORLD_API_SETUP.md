# VWorld API 설정 가이드

## 📋 VWorld API란?

국토교통부에서 제공하는 무료 지오코딩 서비스입니다.
- **무료 할당량**: 월 40,000건
- **API 문서**: https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do
- **인증키 발급**: https://www.vworld.kr/dev/v4dv_2ddataguide2_s001.do

## 🔑 API 키 발급 방법

### 1. VWorld 개발자 포털 접속
https://www.vworld.kr/dev/v4dv_2ddataguide2_s001.do

### 2. 회원가입 및 로그인
- 일반 회원가입 또는 공동인증서 로그인

### 3. 인증키 발급
1. **개발자 포털** → **인증키 관리**
2. **신규 인증키 발급** 클릭
3. 서비스 선택: **주소 검색 (Geocoding)**
4. 인증키 발급 완료

### 4. 환경변수 설정

`.env` 파일에 추가:

```env
VWORLD_API_KEY=your-vworld-api-key-here
```

## 🚀 사용 방법

### CSV 파일에서 병원 데이터 가져오기

```bash
POST http://localhost:3000/api/hospitals/import-csv?filename=hospital_data.csv
```

### 동작 과정

1. CSV 파일 읽기
2. 주소 추출 및 중복 제거
3. VWorld API로 주소 → 좌표 변환
   - 각 주소당 약 100ms 소요
   - 약 6,000개 주소면 약 10분 소요
4. Supabase에 저장

## ⚙️ API 엔드포인트

```
http://api.vworld.kr/req/address
```

### 요청 파라미터

| 파라미터 | 필수 | 설명 |
|---------|------|------|
| service | ✅ | "address" |
| request | ✅ | "getcoord" |
| version | ✅ | "2.0" |
| crs | ✅ | "epsg:4326" (WGS84 좌표계) |
| address | ✅ | 변환할 주소 |
| refine | | "true" (주소 정제) |
| simple | | "false" (상세 정보 포함) |
| format | ✅ | "json" |
| type | | "road" (도로명 주소 우선) |
| key | ✅ | VWorld API 키 |

### 응답 예시

```json
{
  "response": {
    "status": "OK",
    "input": {
      "point": {
        "x": "",
        "y": ""
      }
    },
    "result": [
      {
        "point": {
          "x": "126.9784",  // 경도
          "y": "37.5666"    // 위도
        },
        "text": "서울특별시 종로구 세종대로 209",
        "structure": {
          "level0": "대한민국",
          "level1": "서울특별시",
          "level2": "종로구",
          "level3": "세종로",
          "level4L": "",
          "level4LC": "",
          "level4A": "",
          "level4AC": "",
          "level5": "",
          "detail": "209"
        }
      }
    ]
  }
}
```

## ⚠️ 주의사항

### 1. 월 할당량 관리
- 월 40,000건 제한
- 초과 시 다음 달까지 대기
- 사용량 확인: VWorld 개발자 포털 → 사용량 조회

### 2. HTTP vs HTTPS
- VWorld API는 HTTP만 지원 (HTTPS 미지원)
- 일부 환경(예: 일부 브라우저)에서 제한될 수 있음
- 서버 사이드에서 호출하는 것이 안전

### 3. Rate Limit
- 공식 문서에 명시된 Rate Limit은 없지만
- 과도한 요청은 피하는 것이 좋음
- 현재 구현: 주소당 100ms 딜레이

## 📊 사용량 확인

VWorld 개발자 포털에서:
1. **인증키 관리** → **사용량 조회**
2. 월별 사용량 확인 가능

## 🔧 문제 해결

### 문제 1: API 키가 인식되지 않음

**해결**:
- `.env` 파일에 `VWORLD_API_KEY` 추가 확인
- 서버 재시작 필요

### 문제 2: 좌표 변환 실패

**원인**:
- 주소가 불명확하거나 잘못됨
- API 할당량 초과

**해결**:
- 주소를 더 구체적으로 작성
- 사용량 확인

### 문제 3: HTTP 요청 실패

**원인**:
- 일부 환경에서 HTTP 요청이 차단될 수 있음

**해결**:
- 서버 사이드에서만 호출 (현재 구현)
- 프록시 서버 사용 고려


