export const COMPENSATION_CONSTANTS = {
  // 1. 휴업급여 (Temporary Disability) - 2025년 기준
  TEMPORARY: {
    MAX_DAILY: 258132, // 1일 상한액
    MIN_DAILY: 80240,  // 1일 하한액 (최저임금 연동)
    RATE: 0.7,         // 평균임금의 70%
  },

  // 2. 간병료 (Nursing Fees during Treatment) - 2024년 기준 1일
  NURSING_TREATMENT: {
    PROFESSIONAL: {
      GRADE_1: 67140,
      GRADE_2: 55950,
      GRADE_3: 44760,
    },
    FAMILY: {
      GRADE_1: 61750,
      GRADE_2: 51460,
      GRADE_3: 41170,
    },
  },

  // 3. 간병급여 (Nursing Benefit Post-Treatment) - 2024년 기준 1일
  NURSING_BENEFIT: {
    PROFESSIONAL: {
      CONSTANT: 44760, // 상시
      OCCASIONAL: 29840, // 수시
    },
    FAMILY: {
      CONSTANT: 41170, // 상시
      OCCASIONAL: 27450, // 수시
    },
  },

  // 4. 재활스포츠 (Rehabilitation Sports)
  REHAB_SPORTS: {
    GENERAL_MONTHLY_LIMIT: 100000, // 일반 월 10만원
    SPECIAL_MONTHLY_LIMIT: 600000, // 특수 월 60만원
    GENERAL_DURATION: 3, // 3개월
    SPECIAL_DURATION: 1, // 1개월
  },

  // 5. 직업훈련수당 (Vocational Training Allowance)
  VOCATIONAL_TRAINING: {
    DAILY_LIMIT: 80240, // 1일 최대 8시간분 (최저임금 * 8)
    HOURLY_WAGE: 10030, // 2025 시간당 최저임금
  },

  // 6. 장의비 (Funeral Expenses) - 2025년 기준
  FUNERAL: {
    DAYS: 120, // 평균임금의 120일분
    MAX_AMOUNT: 18685600, // 최고 고시액
    MIN_AMOUNT: 13451380, // 최저 고시액
  },

  // 7. 생활안정자금 융자 (Loans)
  LOAN: {
    INTEREST_RATE: 0.01, // 연 1.0%
    MAX_LIMIT: 30000000, // 최대 3,000만원
  },
};

// 장해급여 등급별 보상일수 (Disability Grade Days)
export const DISABILITY_GRADE_DAYS = [
  { grade: 1, pension: 329, lumpSum: 1474, type: 'PENSION_ONLY' }, // 연금만
  { grade: 2, pension: 291, lumpSum: 1309, type: 'PENSION_ONLY' },
  { grade: 3, pension: 257, lumpSum: 1155, type: 'PENSION_ONLY' },
  { grade: 4, pension: 224, lumpSum: 1012, type: 'CHOICE' },       // 선택 가능
  { grade: 5, pension: 193, lumpSum: 869, type: 'CHOICE' },
  { grade: 6, pension: 164, lumpSum: 737, type: 'CHOICE' },
  { grade: 7, pension: 138, lumpSum: 616, type: 'CHOICE' },
  { grade: 8, pension: null, lumpSum: 495, type: 'LUMPSUM_ONLY' }, // 일시금만
  { grade: 9, pension: null, lumpSum: 385, type: 'LUMPSUM_ONLY' },
  { grade: 10, pension: null, lumpSum: 297, type: 'LUMPSUM_ONLY' },
  { grade: 11, pension: null, lumpSum: 220, type: 'LUMPSUM_ONLY' },
  { grade: 12, pension: null, lumpSum: 154, type: 'LUMPSUM_ONLY' },
  { grade: 13, pension: null, lumpSum: 99, type: 'LUMPSUM_ONLY' },
  { grade: 14, pension: null, lumpSum: 55, type: 'LUMPSUM_ONLY' },
];

// 장해급여 등급별 예시 (Representative Examples)
export const DISABILITY_GRADE_EXAMPLES = [
  { grade: 1, description: "두 눈 실명, 두 다리 무릎관절 이상 상실, 신경/정신 기능 상실로 상시 간병 필요 등" },
  { grade: 2, description: "한 눈 실명+타안 시력 0.02 이하, 두 다리 발목 이상 상실, 신경/정신 기능 수시 간병 필요 등" },
  { grade: 3, description: "두 눈 시력 0.06 이하, 말하거나 씹는 기능 완전 상실, 흉복부 장기 기능 장애로 노무 불가능 등" },
  { grade: 4, description: "두 눈 시력 0.06 이하, 두 손의 손가락 전부 상실, 두 귀의 청력 완전 상실 등" },
  { grade: 5, description: "한 눈 실명, 한 팔/다리 관절 기능 상실, 두 발의 발가락 전부 상실 등" },
  { grade: 6, description: "한 눈 시력 0.02 이하, 한 팔/다리 3대 관절 중 2개 기능 장애, 척주에 뚜렷한 기형/운동장해 등" },
  { grade: 7, description: "한 눈 시력 0.06 이하, 한 손의 손가락 전부 상실, 한 다리 3cm 이상 단축 등" },
  { grade: 8, description: "한 눈 시력 0.1 이하, 한 발의 엄지발가락 포함 2개 이상 상실, 척주에 경미한 기능장해 등" },
  { grade: 9, description: "한 눈 시력 0.6 이하, 한 손의 엄지손가락 상실, 신경계통 기능 장애로 노무 종사 제한 등" },
  { grade: 10, description: "한 눈 시력 1.0 이하, 한 손의 둘째 손가락 상실, 말하거나 씹는 기능에 장애 남음 등" },
  { grade: 11, description: "두 귀 청력 40dB 이상 감퇴, 척주에 기형 남음, 한 손의 가운데 손가락 상실 등" },
  { grade: 12, description: "한 눈 눈꺼풀 결손, 한 귀 청력 50dB 이상 감퇴, 쇄골/견갑골/골반골 등의 기형 등" },
  { grade: 13, description: "한 눈 시력 0.6 이하, 한 손의 새끼손가락 상실, 한 발의 엄지발가락 외의 발가락 기능 장애 등" },
  { grade: 14, description: "한 귀 청력 40dB 이상 감퇴, 한 손의 엄지손가락 지골 골절, 신체 일부 노출면에 흉터 등" },
];

export const COMPENSATION_STAGES = [
  {
    id: 1,
    title: '사고 및 산재 승인',
    description: '업무상 재해 발생 시 가장 먼저 해야 할 일입니다.',
    items: ['요양급여 신청'],
  },
  {
    id: 2,
    title: '집중 치료 (요양)',
    description: '치료에 전념하는 기간 동안 받는 혜택입니다.',
    items: ['요양급여', '휴업급여', '생활안정자금 융자', '상병보상연금(2년 경과 시)'],
  },
  {
    id: 3,
    title: '치료 종결 및 재활',
    description: '치료가 끝난 후 장해 평가 및 재활을 준비합니다.',
    items: ['장해급여', '간병급여', '재활스포츠지원', '합병증 예방관리'],
  },
  {
    id: 4,
    title: '사회 및 직업 복귀',
    description: '원활한 사회 복귀를 위한 지원입니다.',
    items: ['직업재활급여', '직장복귀지원금'],
  },
];
