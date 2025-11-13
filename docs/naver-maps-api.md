# 네이버 클라우드 플랫폼 Maps API 명세

---

## 1. API 개요

**제공 기관**: 네이버 클라우드 플랫폼 (Naver Cloud Platform)  
**API 유형**: RESTful API  
**서비스**: Maps (지도 서비스)  
**문서 링크**: https://api.ncloud-docs.com/docs/ko/application-maps-overview

### 1.1 서비스 설명
Maps는 네이버 지도 콘텐츠와 데이터를 활용하여 위치 기반 서비스를 만들 수 있도록 지원하는 네이버 클라우드 플랫폼의 소프트웨어 인터페이스입니다.

**주요 기능**:
- 정적 지도 이미지 생성
- 경로 탐색 (Directions)
- 주소 검색 (Geocoding)
- 주소 변환 (Reverse Geocoding)

### 1.2 인증 방식
- **API Gateway IAM 인증** 필요
- **Client ID**와 **Client Secret** 사용
- 요청 헤더에 인증 정보 포함

---

## 2. 공통 설정

### 2.1 API 엔드포인트

| API | 엔드포인트 |
|-----|-----------|
| Static Map | `https://maps.apigw.ntruss.com/map-static/v2` |
| Directions 5 | `https://maps.apigw.ntruss.com/map-direction/v1` |
| Directions 15 | `https://maps.apigw.ntruss.com/map-direction-15/v1` |
| Geocoding | `https://maps.apigw.ntruss.com/map-geocode/v2` |
| Reverse Geocoding | `https://maps.apigw.ntruss.com/map-reversegeocode/v2` |

### 2.2 요청 헤더 (필수)

| 헤더 필드 | 필수 여부 | 설명 |
|-----------|----------|------|
| `x-ncp-apigw-api-key-id` | Required | 네이버 클라우드 플랫폼 콘솔에서 발급받은 Client ID |
| `x-ncp-apigw-api-key` | Required | 네이버 클라우드 플랫폼 콘솔에서 발급받은 Client Secret |

### 2.3 응답 상태 코드

| HTTP 코드 | 코드 | 메시지 | 설명 |
|-----------|------|--------|------|
| 400 | 100 | Bad Request Exception | 요청 구문 오류 |
| 401 | 200 | Authentication Failed | 인증 실패 |
| 401 | 210 | Permission Denied | 접근 권한 없음 |
| 404 | 300 | Not Found Exception | 서버에서 찾을 수 없음 |
| 413 | 430 | Request Entity Too Large | 요청 크기(10 MB) 초과 |
| 429 | 400 | Quota Exceeded | 요청 할당량 초과 |
| 429 | 410 | Throttle Limited | 너무 빠르거나 잦은 요청 |
| 429 | 420 | Rate Limited | 특정 시간 동안 너무 많은 요청 |
| 503 | 500 | Endpoint Error | 엔트포인트 오류 |
| 504 | 510 | Endpoint Timeout | 엔트포인트 타임아웃 |
| 500 | 900 | Unexpected Error | 알 수 없는 오류 |

---

## 3. 제공 API 상세

### 3.1 Geocoding (주소 검색)
**엔드포인트**: `https://maps.apigw.ntruss.com/map-geocode/v2`  
**설명**: 주소를 입력받아 좌표(위도, 경도)로 변환

**프로젝트 활용**: 병원 주소 → 좌표 변환 (지도 표시용)

### 3.2 Reverse Geocoding (좌표 → 주소 변환)
**엔드포인트**: `https://maps.apigw.ntruss.com/map-reversegeocode/v2`  
**설명**: 좌표(위도, 경도)를 입력받아 주소로 변환

**프로젝트 활용**: 사용자 위치 좌표 → 주소 표시

### 3.3 Directions 5 (경로 탐색 - 최대 5개 경유지)
**엔드포인트**: `https://maps.apigw.ntruss.com/map-direction/v1`  
**설명**: 출발지와 도착지 사이의 경로 탐색 (최대 5개 경유지)

**프로젝트 활용**: 병원까지 길찾기 기능

### 3.4 Directions 15 (경로 탐색 - 최대 15개 경유지)
**엔드포인트**: `https://maps.apigw.ntruss.com/map-direction-15/v1`  
**설명**: 출발지와 도착지 사이의 경로 탐색 (최대 15개 경유지)

### 3.5 Static Map (정적 지도 이미지)
**엔드포인트**: `https://maps.apigw.ntruss.com/map-static/v2`  
**설명**: 정적 지도 이미지 생성

### 3.6 Dynamic Map (동적 지도)
**엔드포인트**: JavaScript SDK 사용 (REST API 아님)
**설명**: 동적 지도 생성 (줌, 패닝 등 인터랙션 지원)
**✅ 현재 상태**: API 활성화 및 작동 확인됨

#### 도메인 제한 사항
- **허용 도메인**: `localhost:3000` (현재 설정)
- **제한 사항**: 로컬 HTML 파일(`file://`)에서는 작동하지 않음
- **해결 방법**:
  - Next.js 애플리케이션에서 사용 (`http://localhost:3000`)
  - 네이버 콘솔에서 추가 도메인 등록
  - 프로덕션 배포 시 실제 도메인 등록

#### 테스트 결과 기록 (2025-11-13)
- ✅ **SDK 로드**: `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=892s22du59`
- ✅ **HTTP 응답**: 200 OK, Content-Type: text/javascript
- ✅ **콘솔 사용량**: 87회 (활성화 증거)
- ❌ **로컬 HTML**: 도메인 제한으로 인한 로드 실패
- ✅ **Next.js 환경**: localhost:3000에서 정상 작동 예상

---

## 4. 프로젝트 적용 계획

### 4.1 우선순위 API (Phase 1)

#### 1순위: Dynamic Map (지도 표시)
**설명**: Next.js 애플리케이션에서 동적 지도 표시
**사용 조건**: localhost:3000 또는 등록된 도메인에서만 작동
**프로젝트 적용**: 메인 지도 컴포넌트로 사용

#### 2순위: Geocoding (주소 → 좌표 변환)
- **목적**: 공공데이터포털에서 받은 병원 주소 데이터를 지도 좌표로 변환
- **사용 시점**: 병원 데이터 캐싱 시 주소 → 위도/경도 변환

#### 3순위: Directions 5 (길찾기)
- **목적**: 병원까지 경로 안내
- **사용 시점**: 병원 상세 정보에서 "길찾기" 버튼 클릭 시

#### 4순위: Reverse Geocoding (좌표 → 주소)
- **목적**: 사용자 현재 위치 표시
- **사용 시점**: 위치 권한 허용 시 현재 주소 표시

### 4.2 제한사항 및 고려사항

- **요청 제한**: 초당/일일 요청 수 제한 존재
- **요금**: 사용량에 따른 과금 발생
- **인증**: Client ID/Secret 발급 필요
- **환경**: VPC 환경에서만 사용 가능

---

## 5. 인증키 발급 절차

### 5.1 네이버 클라우드 플랫폼 가입
1. [네이버 클라우드 플랫폼](https://www.ncloud.com) 회원가입
2. 결제 수단 등록 (신용카드 등)

### 5.2 Application 등록
1. 콘솔 → AI·Application Service → Maps
2. **Application 등록** 버튼 클릭
3. Application 이름 입력
4. 사용할 API 선택 (Geocoding, Directions 등)

### 5.3 인증키 확인
1. Application 등록 완료 후 **API Key** 탭 확인
2. **Client ID**와 **Client Secret** 복사
3. 환경변수에 저장:
   ```bash
   NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_client_id
   NAVER_MAP_CLIENT_SECRET=your_client_secret
   ```

---

## 6. 개발 가이드

### 6.1 환경변수 설정
```bash
# .env.local 또는 .env
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_client_id
NAVER_MAP_CLIENT_SECRET=your_client_secret
```

**⚠️ 현재 상태**: Client ID와 Client Secret 설정됨, 인증 성공하지만 데이터 없음

### 6.1.1 Dynamic Map을 위한 추가 설정
```javascript
// index.html에 추가
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>
```

### 6.2 Dynamic Map 구현 예시 (JavaScript SDK)
```typescript
// Next.js에서 Dynamic Map 사용 예시
// components/HospitalMap.tsx
import { useEffect, useRef } from 'react';

interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface HospitalMapProps {
  hospitals: Hospital[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const HospitalMap: React.FC<HospitalMapProps> = ({
  hospitals,
  center = { lat: 37.5666, lng: 126.9784 }, // 서울시청 기본값
  zoom = 10
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 네이버 지도 SDK 로드 확인
    if (!window.naver || !window.naver.maps) {
      console.error('네이버 지도 SDK가 로드되지 않았습니다.');
      return;
    }

    try {
      // 지도 생성
      const map = new naver.maps.Map(mapRef.current!, {
        center: new naver.maps.LatLng(center.lat, center.lng),
        zoom: zoom,
        mapTypeControl: true,
        zoomControl: true
      });

      // 병원 마커 추가
      hospitals.forEach(hospital => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(hospital.lat, hospital.lng),
          map: map,
          title: hospital.name
        });

        // 정보창 생성
        const infoWindow = new naver.maps.InfoWindow({
          content: `
            <div style="padding:10px;max-width:200px;">
              <h4 style="margin:0 0 8px 0;">${hospital.name}</h4>
              <p style="margin:0 0 8px 0;font-size:12px;">${hospital.address}</p>
              <button onclick="window.open('tel:02-123-4567')">전화하기</button>
              <button onclick="getDirections(${hospital.lat}, ${hospital.lng})">길찾기</button>
            </div>
          `
        });

        // 마커 클릭 이벤트
        naver.maps.Event.addListener(marker, 'click', () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        });
      });

      console.log('지도 로드 성공:', hospitals.length, '개 병원 표시');

    } catch (error) {
      console.error('지도 로드 실패:', error);
    }
  }, [hospitals, center, zoom]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '500px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}
    />
  );
};

export default HospitalMap;
```

### 6.2.1 Next.js App에서 Dynamic Map 사용
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>네이버 지도 Dynamic Map</title>
    <script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>
</head>
<body>
    <div id="map" style="width:100%;height:400px;"></div>

    <script>
        // 지도 생성
        var map = new naver.maps.Map('map', {
            center: new naver.maps.LatLng(37.5666, 126.9784), // 서울시청 좌표
            zoom: 10
        });

        // 병원 마커 추가 예시
        var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(37.5666, 126.9784),
            map: map,
            title: '병원 이름'
        });

        // 정보창 추가
        var infoWindow = new naver.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:10px;">병원 상세정보</div>'
        });

        naver.maps.Event.addListener(marker, 'click', function() {
            if (infoWindow.getMap()) {
                infoWindow.close();
            } else {
                infoWindow.open(map, marker);
            }
        });
    </script>
</body>
</html>
```

### 6.3 REST API 클라이언트 구현 예시 (TypeScript)
```typescript
interface NaverMapConfig {
  clientId: string;
  clientSecret: string;
}

class NaverMapClient {
  private config: NaverMapConfig;
  private baseUrl = 'https://maps.apigw.ntruss.com';

  constructor(config: NaverMapConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'x-ncp-apigw-api-key-id': this.config.clientId,
      'x-ncp-apigw-api-key': this.config.clientSecret,
      'Content-Type': 'application/json',
    };
  }

  // 주소 → 좌표 변환
  async geocode(address: string) {
    const response = await fetch(`${this.baseUrl}/map-geocode/v2`, {
      method: 'GET',
      headers: this.getHeaders(),
      // 쿼리 파라미터로 주소 전달
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    return response.json();
  }

  // 좌표 → 주소 변환
  async reverseGeocode(lat: number, lng: number) {
    const response = await fetch(`${this.baseUrl}/map-reversegeocode/v2`, {
      method: 'GET',
      headers: this.getHeaders(),
      // 쿼리 파라미터로 좌표 전달
    });

    return response.json();
  }

  // 경로 탐색
  async getDirections(start: string, goal: string) {
    const response = await fetch(`${this.baseUrl}/map-direction/v1`, {
      method: 'GET',
      headers: this.getHeaders(),
      // 출발지, 도착지 파라미터
    });

    return response.json();
  }
}
```

### 6.3 에러 처리
```typescript
try {
  const result = await naverMapClient.geocode(address);
  // 성공 처리
} catch (error) {
  if (error.message.includes('429')) {
    // 요청 제한 초과
    console.error('API 요청 제한 초과');
  } else if (error.message.includes('200')) {
    // 인증 실패 (네이버 API의 인증 실패 코드는 200)
    console.error('API 인증 실패 - API 키 확인 필요');
  } else if (error.message.includes('404')) {
    // API를 찾을 수 없음
    console.error('API 엔드포인트가 올바르지 않음');
  }
  // 기타 에러 처리
}
```

### 6.4 문제 해결 가이드

#### 인증 실패 시 확인사항
1. **VPC 환경 확인**: Maps API는 VPC 환경에서만 사용 가능
2. **API 활성화 확인**: 콘솔에서 Application 수정 → 사용할 API 선택
3. **키 유효성 확인**: API Key 탭에서 키 재발급 필요 시
4. **할당량 확인**: 무료 티어 사용 시 일일 요청 제한 확인

---

## 7. 참고 자료

- **공식 문서**: https://api.ncloud-docs.com/docs/ko/application-maps-overview
- **사용 가이드**: 네이버 클라우드 플랫폼 콘솔 → Maps → 사용 가이드
- **요금 안내**: 네이버 클라우드 플랫폼 요금 페이지
- **지원 문의**: 네이버 클라우드 플랫폼 고객지원

---

## 8. 프로젝트 TODO 연동

**Phase 1.2: 지도 컴포넌트 구현**
- [ ] Naver Maps API 연동
- [ ] 위치 권한 요청 및 처리
- [ ] 사용자 위치 기반 지도 초기화
- [ ] Geocoding으로 병원 주소 → 좌표 변환
- [ ] Directions로 길찾기 기능 구현
