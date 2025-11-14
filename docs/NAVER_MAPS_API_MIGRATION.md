# 네이버 지도 API v3 마이그레이션 가이드

## 문제 상황
- 지도 화면이 1초 뒤에 사라지는 현상
- "NAVER Maps JavaScript API v3 신규 Maps API 전환 안내" 메시지 표시
- 구버전 API가 점진적으로 종료됨

## 해결 방법

### 1. 신규 클라이언트 ID 발급
네이버 클라우드 플랫폼에서 신규 클라이언트 ID를 발급받아야 합니다.

**참고 링크**:
- 공지사항: https://www.ncloud.com/support/notice/all/1930
- 변경 적용 가이드: https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html

### 2. 코드 변경 사항

#### 변경 전 (구버전)
```javascript
// 구버전 SDK 로드 URL
script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
```

#### 변경 후 (신규 v3)
```javascript
// 신규 NCP Maps API v3 SDK 로드 URL
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
```

**주요 변경점**:
1. URL 변경: `openapi.map.naver.com` → `oapi.map.naver.com`
2. 파라미터 변경: `ncpClientId` → `ncpKeyId`

### 3. 환경변수 확인
`.env` 파일에 신규 클라이언트 ID가 설정되어 있는지 확인:
```env
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_new_ncp_key_id
```

### 4. 적용된 파일
- `components/HospitalMap.tsx`: SDK 로드 URL 및 파라미터 수정

## 추가 참고사항
- 신규 API는 기존 API와 호환되지만, 클라이언트 ID는 새로 발급받아야 함
- 기존 클라이언트 ID는 점진적으로 지원이 중단됨
- 신규 클라이언트 ID 발급 후 즉시 적용 가능


