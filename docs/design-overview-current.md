## 리워크케어 현재 디자인 컨셉 정리 (실제 구현 기준)

이 문서는 **현재 프로젝트에 실제로 적용된 디자인 시스템**을 정리한 것입니다.  
디자인 전문가가 이 내용을 기반으로 개선안을 설계하고, 이후 이 프로젝트에 반영하기 위한 레퍼런스로 사용하면 됩니다.

---

### 1. 전체 컨셉

- **키워드**: Warm & Rounded, 자연/회복, 디지털 케어 코디네이터
- **목표 경험**
  - 따뜻한 크림색 배경 + 연한 민트 보조 배경으로 **병원보다 편안한 느낌**을 주는 화면
  - 네모반듯한 카드 대신 **둥근 모서리, 부드러운 그림자**로 긴장감을 줄이는 레이아웃
  - 리우(Riu) 캐릭터를 곳곳에 배치해, **“디지털 케어 코디네이터”** 느낌을 강화

---

### 2. 컬러 시스템 (실제 CSS 변수 기준)

#### 2.1 기본 배경/텍스트

- `--background`: `#FFFCF5`  
  - 메인 배경, **Warm Cream**  
  - 눈이 편한 따뜻한 크림색, 앱 전체 공통 배경
- `--background-alt`: `#F5F9F6`  
  - 서브 배경, **Soft Mint**  
  - 카드 안쪽 배경, 서브 섹션 배경 등
- `--foreground`: `#1C1C1E`  
  - 기본 텍스트 컬러 (진한 회색)

#### 2.2 메인 포인트 컬러

- `--primary`: `#2F6E4F` (**Deep Green**)  
  - 의미: 신뢰, 안정, 회복, 자연  
  - 사용 위치:
    - 주요 버튼(`Button` 기본 variant)
    - 타임라인 단계 번호 배지, 연결선, 아이콘 강조
    - 포커스 아웃라인(`outline: 2px solid var(--primary)`)
    - 주요 링크/인터랙션 포인트
- `--primary-foreground`: `#FFFFFF`  
  - primary 배경 위 텍스트 컬러

#### 2.3 서브/포인트 컬러

- `--secondary`: `#A5D6A7` (**Soft Green**)  
  - 보조 버튼, 녹색 계열 포인트 배경 등에 사용
- `--accent`: `#FFD54F` (**Warm Yellow**)  
  - 리우 캐릭터 볼터치, 강조 배너(`.berry-card`), warm gradient 등에 사용
- `--alert`: `#FF9500`  
  - 법적 고지, 주의 문구(타임라인 주의사항, 면책 조항 등)에 사용

#### 2.4 기관별 컬러 (병원/약국/재활)

- `--color-hospital`: `#2F6E4F` (병원, primary와 동일)
- `--color-pharmacy`: `#34C759` (약국)
- `--color-rehabilitation`: `#9333EA` (재활기관)
- `--color-hospital-alt`: `#2E7D32` (병원 마커 보조 색상)

이 색상들은 **지도 마커, 필터 라벨** 등에 사용됩니다.

---

### 3. 타이포그래피 시스템

#### 3.1 폰트 패밀리

- **브랜드 폰트**: `Paperozi`
  - 변수: `--font-brand`
  - 사용 위치:
    - 브랜드 로고/브랜드명
    - 주요 헤드라인(h1~h3)에 선택적으로 사용
    - 버튼 텍스트(`Button` 기본 클래스에 `font-brand` 포함)
- **본문 폰트**: `Pretendard`
  - 변수: `--font-sans`
  - 사용 위치:
    - 전체 body 기본 폰트
    - 일반 텍스트, 입력폼, 설명 등

#### 3.2 타이포 스케일 (globals.css 기준)

- `h1`: 30px, bold, `font-brand`, letter-spacing -0.02em
- `h2`: 22px, semibold, `font-brand`
- `h3`: 18px, semibold, `font-brand`
- `body`: 17px, regular, letter-spacing -0.02em
- `.caption`: 14px, regular

**특징**
- 전체적으로 **약간 좁은 자간(-0.02em)** 을 사용해 단단한 느낌을 줌
- 헤드라인은 브랜드 폰트, 본문은 Pretendard로 **브랜드성 + 가독성**을 동시에 확보

---

### 4. 쉐도우·라운드·표면 스타일

#### 4.1 그림자(Shadow) 시스템

- `--shadow-leaf`: `0 2px 8px rgba(0,0,0,0.04)` (기본)
- `--shadow-branch`: `0 4px 16px rgba(0,0,0,0.04)` (중간)
- `--shadow-canopy`: `0 8px 30px rgba(0,0,0,0.04)` (강한)

**의도**:  
“카드가 살짝 공중에 떠 있는 나뭇잎” 같은 가벼운 깊이를 주되, 과한 입체감을 피해서 **차분한 느낌 유지**

#### 4.2 모서리(Radius) 시스템

- `--radius-sm`: 0.75rem (12px)
- `--radius-md`: 1rem (16px, rounded-2xl)
- `--radius-lg`: 1.25rem (20px)
- `--radius-xl`: 1.5rem (24px)
- `--radius`: 1rem (프로젝트 기본 radius)

**Button, Input, 카드 대부분이 `rounded-2xl` 수준의 둥근 모서리**를 사용합니다.

#### 4.3 표면 유틸리티 클래스 (globals.css)

- `.bg-warm-gradient`
  - `linear-gradient(135deg, rgba(255,213,79,0.08), rgba(165,214,167,0.12))`
  - 챗봇 배너, 강조 섹션 등에 사용 가능
- `.warm-surface`
  - Warm gradient + `border: 1px solid var(--border-light)` + `shadow-canopy`
  - 핵심 카드, 중요한 안내 섹션에서 사용
- `.leaf-section` / `.leaf-section-strong` / `.leaf-section-top` / `.leaf-section-bottom`
  - 은은한 초록/노랑 **radial-gradient** 패턴
  - 서류 안내 카드, 특정 섹션 배경에 사용
- `.berry-card`
  - 법적 고지/주의 안내용 강조 카드  
  - Warm Yellow + 크림 배경 혼합 그라데이션 + `shadow-canopy`

---

### 5. 핵심 UI 컴포넌트 스타일 (실제 코드 기준)

#### 5.1 버튼 (`components/ui/button.tsx`)

- 공통 기본 클래스:
  - `rounded-2xl`, `shadow-leaf` (hover 시 `shadow-canopy`, active 시 `shadow-branch`)
  - `font-brand` (브랜드 폰트로 버튼을 강조)
  - `focus-visible:ring-ring/50`, `focus-visible:ring-[3px]` (primary 기반 포커스 링)
- Variant별:
  - `default`: `bg-primary text-primary-foreground`
  - `outline`: 연한 초록 테두리(`border-[#E8F5E9]`), 배경 투명
  - `secondary`: `bg-secondary`
  - `ghost`: 배경 투명, 텍스트만 강조

**정리**: 버튼은 **둥글고, 살짝 떠 있고, 초록색을 메인으로 쓰는 Warm & Rounded 버튼**입니다.

#### 5.2 입력창 (`components/ui/input.tsx`)

- `rounded-2xl`, `border-[var(--border-light)]`
- `shadow-leaf`로 가벼운 그림자
- 선택 영역(`selection`)은 `bg-primary`, `text-primary-foreground`
- 포커스 시 `border-ring` + `ring-ring/50`

입력폼도 버튼과 동일하게 “둥글고 부드러운 초록 톤”으로 통일되어 있습니다.

#### 5.3 리우 캐릭터 (`components/icons/riu-icon.tsx`)

- 얼굴/외곽선: `#2F6E4F` (primary)
- 볼터치: `#FFD54F` (accent)
- 잎사귀: `#A5D6A7` (soft green)
- 애니메이션:
  - `.animate-riu-bounce` (통통 튀는 모션)
  - `.animate-leaf-sway` (나뭇잎이 살짝 흔들리는 모션)

**컨셉**:  
“따뜻한 초록색 마스코트가 옆에서 응원/안내해 주는 느낌”을 시각적으로 구현합니다.

---

### 6. 페이지/패턴별 컨셉 (현재 구현 요약)

#### 6.1 병원 찾기 페이지

- 배경: Warm Cream + Soft Mint
- 지도 + 리스트 2컬럼 구조(데스크톱), 모바일에서는 상하 구조
- 병원/약국/재활기관 마커 색상:
  - 병원: primary green
  - 약국: pharmacy green
  - 재활: purple
- 카드/필터 UI: 초록 계열 border + 둥근 모서리 + 얕은 그림자

#### 6.2 서류 안내 페이지

- 상단에 **안내 문구 + 면책 조항(berry-card 스타일)** 배치
- 각 서류는 카드/리스트 형태, Warm & Rounded 스타일 유지
- “작성방법 보기”, “PDF 보기” 버튼은 초록계 버튼 사용

#### 6.3 산재 절차 타임라인

- 타임라인 카드:
  - 배경: `bg-primary/5` (연한 초록)
  - 테두리: `border-primary/30`
  - 단계 번호 배지: `bg-primary`, 흰색 텍스트
- 타임라인 연결선: `bg-primary/30`
- 요약 배지:
  - 해야 할 일 / 서류: primary 배경/텍스트
  - 주의사항: alert(주황색) 배경/텍스트
- 상세 탭:
  - 활성 탭: `bg-primary`, 흰색 텍스트
  - 비활성 탭: `bg-primary/5`, `border-primary/20`

**의도**:  
단계 진행 흐름과 “지금 내가 어디쯤 와 있는지”를 **초록 타임라인**으로 한눈에 보여주기.

---

### 7. 접근성·인터랙션

- 포커스 링:
  - `*:focus-visible` 에 `outline: 2px solid var(--primary)`
  - 버튼/링크는 추가로 `focus-visible:ring` 사용
- 스크린리더:
  - `.sr-only` 유틸리티 제공
  - 리우 아이콘은 `aria-label`로 상태 설명 (예: “리우가 응원하고 있어요”)
- 인터랙션:
  - Hover 시 그림자/배경만 살짝 강화 (색 반전/강한 애니메이션은 없음)
  - “Calm(차분함)” 유지가 목표

---

### 8. 전문가용 요약 포인트

전문가가 이 프로젝트의 디자인을 리디자인/리파인할 때 알아두면 좋은 핵심 포인트입니다.

1. **현재 테마는 “Warm & Rounded + Deep Green”이 중심**입니다.
2. **Primary Deep Green(#2F6E4F)**, **Warm Yellow(#FFD54F)**, **Soft Mint 배경**이 브랜드 정체성을 만듭니다.
3. 버튼/입력/카드 모두 **rounded-2xl + 얕은 그림자(leaves)** 패턴을 공유합니다.
4. 리우 캐릭터의 색 구성(초록/노랑)과 전체 팔레트가 맞물려 있습니다.
5. 법적/주의 정보는 **주황(Alert) + berry-card 스타일**로 강조합니다.
6. 타임라인, 병원 지도, 서류 안내 3개 핵심 기능은 **같은 색/라운드/쉐도우 시스템**을 공유합니다.

이 문서를 바탕으로,
- 색상 체계 재정의 (예: 더 세분화된 토큰, 다크 모드 통일)
- 컴포넌트별 여백/폰트/쉐도우 레벨 표준화
- 리우 캐릭터 노출 위치/사이즈 가이드
등을 설계해 주시면, 제가 이후 이 프로젝트 코드에 그대로 반영해 드릴 수 있습니다.


