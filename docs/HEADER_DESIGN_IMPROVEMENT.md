# 헤더 디자인 개선 계획

## 📋 현재 문제점

1. **헤더 디자인이 전문적이지 않음**
   - 단순한 텍스트 로고만 표시
   - 시각적 계층 구조 부족
   - 브랜드 아이덴티티 부재

2. **폰트 문제**
   - 현재 Pretendard 폰트만 사용
   - 브랜드 폰트(Paperozi) 미적용

---

## 🎯 개선 목표

1. **전문적이고 신뢰감 있는 헤더 디자인**
   - 브랜드 아이덴티티 강화
   - 명확한 시각적 계층 구조
   - 일관된 디자인 시스템 적용

2. **Paperozi 웹폰트 적용**
   - 로고/브랜드명에 Paperozi 폰트 사용
   - 다양한 font-weight 지원 (100-900)

---

## 📐 디자인 개선 계획

### Phase 1: Paperozi 폰트 설정 (30분)

#### 1.1 폰트 파일 추가
**파일**: `app/globals.css`

```css
/* Paperozi 웹폰트 정의 */
@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-1Thin.woff2') format('woff2');
  font-weight: 100;
  font-display: swap;
}

@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-2ExtraLight.woff2') format('woff2');
  font-weight: 200;
  font-display: swap;
}

@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-3Light.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}

@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-5Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-6SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-7Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-8ExtraBold.woff2') format('woff2');
  font-weight: 800;
  font-display: swap;
}

@font-face {
  font-family: 'Paperozi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-9Black.woff2') format('woff2');
  font-weight: 900;
  font-display: swap;
}
```

#### 1.2 CSS 변수 추가
**파일**: `app/globals.css`

```css
:root {
  /* 폰트 패밀리 */
  --font-brand: 'Paperozi', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}
```

#### 1.3 Tailwind 설정
**파일**: `app/globals.css` (기존 `@theme inline` 블록에 추가)

```css
@theme inline {
  --font-brand: var(--font-brand);
  /* ... 기존 설정 ... */
}
```

---

### Phase 2: 헤더 디자인 개선 (1-2시간)

#### 2.1 Navbar 컴포넌트 개선
**파일**: `components/Navbar.tsx`

**개선 사항**:
1. **로고/브랜드명 스타일링**
   - Paperozi 폰트 적용 (font-weight: 700 또는 800)
   - 크기 조정 (text-2xl 또는 text-3xl)
   - 색상: Primary 색상 (#3478F6) 또는 Neutral 텍스트 (#1C1C1E)
   - 간격 및 패딩 조정

2. **헤더 레이아웃 개선**
   - 배경색: Neutral 배경 (#F2F2F7) 또는 흰색
   - 그림자 효과 추가 (subtle shadow)
   - 패딩 및 간격 최적화
   - 최대 너비 및 중앙 정렬

3. **로그인 버튼 스타일링**
   - 디자인 시스템에 맞는 버튼 스타일
   - 적절한 크기 및 간격

**디자인 예시**:
```tsx
<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <Link 
        href="/" 
        className="text-2xl font-bold text-[#1C1C1E] font-brand tracking-tight hover:text-[#3478F6] transition-colors"
        style={{ fontFamily: 'Paperozi, sans-serif' }}
      >
        리워크케어
      </Link>
      <div className="flex gap-4 items-center">
        {/* 로그인 버튼 */}
      </div>
    </div>
  </div>
</header>
```

#### 2.2 ResponsiveNavigation 개선
**파일**: `components/ResponsiveNavigation.tsx`

**개선 사항**:
1. **데스크톱 네비게이션**
   - 헤더와 통합된 디자인
   - 활성 탭 표시 개선
   - 호버 효과 추가

2. **모바일 하단 탭**
   - 배경 블러 효과
   - 아이콘 및 텍스트 정렬 개선
   - 활성 상태 시각적 피드백 강화

---

### Phase 3: 디자인 시스템 통합 (30분)

#### 3.1 design.md 업데이트
**파일**: `docs/design.md`

**추가 내용**:
- Paperozi 폰트를 브랜드 폰트로 지정
- 헤더 디자인 가이드라인 추가
- 폰트 사용 규칙 정의

#### 3.2 일관성 검증
- 모든 헤더 관련 컴포넌트에서 동일한 스타일 적용
- 반응형 디자인 검증
- 접근성 확인 (색상 대비, 폰트 크기)

---

## 🎨 디자인 상세

### 헤더 구조

```
┌─────────────────────────────────────────────────┐
│ [리워크케어]                    [로그인] [User] │
├─────────────────────────────────────────────────┤
│ [📍 병원 찾기] [📄 서류 안내]                   │
└─────────────────────────────────────────────────┘
```

### 색상 및 스타일

- **배경**: `#FFFFFF` (흰색) 또는 `#F2F2F7` (Neutral 배경)
- **브랜드명**: `#1C1C1E` (Neutral 텍스트) 또는 `#3478F6` (Primary)
- **폰트**: Paperozi (font-weight: 700-800)
- **크기**: text-2xl 또는 text-3xl
- **그림자**: subtle shadow (shadow-sm)

### 반응형 고려사항

- **모바일**: 헤더 높이 최소화, 로고 크기 조정
- **태블릿**: 중간 크기 유지
- **데스크톱**: 넓은 화면 활용, 여백 증가

---

## 📝 구현 체크리스트

### Phase 1: 폰트 설정
- [ ] Paperozi @font-face 정의 추가 (`app/globals.css`)
- [ ] CSS 변수 추가 (`--font-brand`)
- [ ] Tailwind 설정 업데이트
- [ ] 폰트 로딩 테스트

### Phase 2: 헤더 디자인
- [ ] Navbar 컴포넌트 스타일 개선
  - [ ] Paperozi 폰트 적용
  - [ ] 레이아웃 및 간격 조정
  - [ ] 그림자 효과 추가
  - [ ] 호버 효과 추가
- [ ] ResponsiveNavigation 스타일 개선
  - [ ] 데스크톱 네비게이션 통합
  - [ ] 모바일 탭 바 개선
- [ ] 반응형 디자인 검증

### Phase 3: 디자인 시스템
- [ ] design.md 업데이트
- [ ] 폰트 사용 규칙 문서화
- [ ] 접근성 검증
- [ ] 크로스 브라우저 테스트

---

## ⚠️ 고려사항

### 1. 폰트 로딩 성능
- `font-display: swap` 사용으로 텍스트 깜빡임 방지
- 폰트 파일 크기 최적화 고려
- 폴백 폰트 설정 (Pretendard)

### 2. 브라우저 호환성
- WOFF2 형식 지원 확인
- 구형 브라우저 대응 (폴백)

### 3. 접근성
- 폰트 크기 최소 16px 유지
- 색상 대비 비율 확인 (WCAG AA)
- 키보드 네비게이션 지원

---

## 📊 예상 소요 시간

| Phase | 작업 | 예상 시간 |
|-------|------|-----------|
| Phase 1 | 폰트 설정 | 30분 |
| Phase 2 | 헤더 디자인 개선 | 1-2시간 |
| Phase 3 | 디자인 시스템 통합 | 30분 |
| **총계** | | **2-3시간** |

---

## 🎯 우선순위

**Priority 1 (높음)**: 브랜드 아이덴티티 및 사용자 신뢰도 향상

**의존성**: 없음 (독립적으로 구현 가능)

