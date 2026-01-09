/**
 * 산재 급여 계산 유틸리티
 * 근로복지공단 규정에 기반한 계산 로직
 */

// ============================================
// 상수 정의 (2025년 기준)
// ============================================

export const CONSTANTS_2025 = {
  /** 최저 보상기준 (1일) - 전체 근로자 평균임금의 1/2 */
  MIN_COMPENSATION_BASE: 80240,
  
  /** 최저임금 (1일) - 시급 10,030원 × 8시간 기준 */
  MIN_WAGE_DAILY: 80240,
  
  /** 휴업급여 기본 비율 (70%) */
  SICK_LEAVE_RATE: 0.7,
  
  /** 휴업급여 저소득 특례 비율 (90%) */
  SICK_LEAVE_SPECIAL_RATE: 0.9,
  
  /** 최저보상기준의 80% (저소득 특례 기준) */
  MIN_COMPENSATION_80_PERCENT: 80240 * 0.8, // 64,192원
};

// ============================================
// 장해등급별 보상일수
// ============================================

export const DISABILITY_DAYS: Record<number, number | { lump: number; pension: number }> = {
  1: 1474,   // 연금만
  2: 1309,   // 연금만
  3: 1155,   // 연금만
  4: { lump: 1012, pension: 1340 },  // 선택
  5: { lump: 869, pension: 1150 },    // 선택
  6: { lump: 737, pension: 975 },    // 선택
  7: { lump: 616, pension: 815 },    // 선택
  8: 495,    // 일시금만
  9: 385,    // 일시금만
  10: 297,   // 일시금만
  11: 220,   // 일시금만
  12: 154,   // 일시금만
  13: 99,    // 일시금만
  14: 55,    // 일시금만
};

// ============================================
// 고령자 감액 비율 (61세 이상)
// ============================================

export const AGE_REDUCTION: Record<number, number> = {
  61: 66 / 70,  // 94.3%
  62: 62 / 70,  // 88.6%
  63: 58 / 70,  // 82.9%
  64: 54 / 70,  // 77.1%
  65: 50 / 70,  // 71.4% (65세 이상 동일)
};

// ============================================
// 평균임금 계산
// ============================================

export interface AverageWageResult {
  /** 1일 평균임금 */
  dailyWage: number;
  /** 월 평균임금 (참고용) */
  monthlyWage: number;
  /** 계산 설명 */
  explanation: string;
}

/**
 * 평균임금 계산
 * @param month1 첫 번째 달 월급
 * @param month2 두 번째 달 월급
 * @param month3 세 번째 달 월급
 * @returns 평균임금 계산 결과
 */
export function calculateAverageWage(
  month1: number,
  month2: number,
  month3: number
): AverageWageResult {
  const totalWage = month1 + month2 + month3;
  const totalDays = 90; // 간소화: 평균 90일 사용
  const dailyWage = Math.round(totalWage / totalDays);
  const monthlyWage = Math.round(dailyWage * 30);

  return {
    dailyWage,
    monthlyWage,
    explanation: `최근 3개월 임금 총액 ${totalWage.toLocaleString()}원 ÷ ${totalDays}일 = ${dailyWage.toLocaleString()}원/일`,
  };
}

// ============================================
// 휴업급여 계산
// ============================================

export interface SickLeaveResult {
  /** 1일 휴업급여 */
  dailyAmount: number;
  /** 총 휴업급여 */
  totalAmount: number;
  /** 적용된 비율 (0.7 또는 0.9) */
  appliedRate: number;
  /** 계산 설명 */
  explanation: string;
  /** 특례 적용 여부 */
  isSpecialCase: boolean;
  /** 고령자 감액 적용 여부 */
  isAgeReduction: boolean;
}

/**
 * 휴업급여 계산
 * @param averageWage 1일 평균임금
 * @param days 휴업일수
 * @param age 나이 (선택, 61세 이상 시 감액)
 * @returns 휴업급여 계산 결과
 */
export function calculateSickLeave(
  averageWage: number,
  days: number,
  age?: number
): SickLeaveResult {
  let dailyAmount = averageWage * CONSTANTS_2025.SICK_LEAVE_RATE;
  let appliedRate = CONSTANTS_2025.SICK_LEAVE_RATE;
  let explanation = `평균임금 ${averageWage.toLocaleString()}원 × 70% = ${Math.round(dailyAmount).toLocaleString()}원/일`;
  let isSpecialCase = false;
  let isAgeReduction = false;

  // 1단계: 저소득 특례 적용 확인
  const minCompensation80 = CONSTANTS_2025.MIN_COMPENSATION_80_PERCENT;
  
  if (dailyAmount <= minCompensation80) {
    // 평균임금의 90% 계산
    const specialAmount = averageWage * CONSTANTS_2025.SICK_LEAVE_SPECIAL_RATE;
    
    // 평균임금의 90%와 최저보상기준 80% 중 작은 값 적용
    dailyAmount = Math.min(specialAmount, minCompensation80);
    appliedRate = CONSTANTS_2025.SICK_LEAVE_SPECIAL_RATE;
    isSpecialCase = true;
    
    if (specialAmount > minCompensation80) {
      explanation = `저소득 특례 적용: 최저보상기준의 80% = ${Math.round(minCompensation80).toLocaleString()}원/일`;
    } else {
      explanation = `저소득 특례 적용: 평균임금 ${averageWage.toLocaleString()}원 × 90% = ${Math.round(dailyAmount).toLocaleString()}원/일`;
    }
  }

  // 2단계: 최저임금 보장
  if (dailyAmount < CONSTANTS_2025.MIN_WAGE_DAILY) {
    dailyAmount = CONSTANTS_2025.MIN_WAGE_DAILY;
    explanation = `최저임금 적용: ${CONSTANTS_2025.MIN_WAGE_DAILY.toLocaleString()}원/일`;
  }

  // 3단계: 고령자 감액 적용 (61세 이상)
  if (age && age >= 61) {
    const ageKey = Math.min(age, 65); // 65세 이상은 동일 비율
    const reduction = AGE_REDUCTION[ageKey];

    dailyAmount = Math.round(dailyAmount * reduction);
    isAgeReduction = true;
    explanation += `\n→ ${age}세 고령자 감액 적용 (${Math.round(reduction * 100)}%): ${dailyAmount.toLocaleString()}원/일`;
  }

  const totalAmount = Math.round(dailyAmount * days);

  return {
    dailyAmount: Math.round(dailyAmount),
    totalAmount,
    appliedRate,
    explanation,
    isSpecialCase,
    isAgeReduction,
  };
}

// ============================================
// 장해급여 계산
// ============================================

export interface DisabilityResult {
  /** 일시금 금액 (해당 시) */
  lumpSum?: number;
  /** 연금 금액 (해당 시) */
  pension?: number;
  /** 지급 방식 */
  paymentType: 'lump' | 'pension' | 'choice';
  /** 보상일수 */
  days: number;
  /** 계산 설명 */
  explanation: string;
  /** 등급 설명 */
  gradeDescription: string;
}

/**
 * 장해급여 계산
 * @param averageWage 1일 평균임금
 * @param grade 장해등급 (1~14급)
 * @returns 장해급여 계산 결과
 */
export function calculateDisability(
  averageWage: number,
  grade: number
): DisabilityResult {
  const gradeData = DISABILITY_DAYS[grade];
  
  if (!gradeData) {
    throw new Error(`유효하지 않은 장해등급: ${grade}`);
  }

  // 1~3급: 연금만
  if (grade <= 3) {
    const days = gradeData as number;
    const pension = Math.round(averageWage * days);
    
    return {
      pension,
      paymentType: 'pension',
      days,
      explanation: `평균임금 ${averageWage.toLocaleString()}원 × ${days.toLocaleString()}일 = ${pension.toLocaleString()}원`,
      gradeDescription: `${grade}급은 연금으로만 지급됩니다 (매월 지급)`,
    };
  }
  
  // 4~7급: 선택 가능
  if (grade <= 7) {
    const { lump, pension: pensionDays } = gradeData as { lump: number; pension: number };
    const lumpSum = Math.round(averageWage * lump);
    const pension = Math.round(averageWage * pensionDays);
    
    return {
      lumpSum,
      pension,
      paymentType: 'choice',
      days: lump,
      explanation: `일시금: 평균임금 ${averageWage.toLocaleString()}원 × ${lump.toLocaleString()}일 = ${lumpSum.toLocaleString()}원\n연금: 평균임금 ${averageWage.toLocaleString()}원 × ${pensionDays.toLocaleString()}일 = ${pension.toLocaleString()}원`,
      gradeDescription: `${grade}급은 일시금 또는 연금 중 선택 가능합니다`,
    };
  }
  
  // 8~14급: 일시금만
  const days = gradeData as number;
  const lumpSum = Math.round(averageWage * days);
  
  return {
    lumpSum,
    paymentType: 'lump',
    days,
    explanation: `평균임금 ${averageWage.toLocaleString()}원 × ${days.toLocaleString()}일 = ${lumpSum.toLocaleString()}원`,
    gradeDescription: `${grade}급은 일시금으로만 지급됩니다`,
  };
}

// ============================================
// 숫자 포맷팅 유틸리티
// ============================================

/**
 * 숫자를 천 단위 콤마 형식으로 변환
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString('ko-KR');
}

/**
 * 금액을 원 단위로 표시
 */
export function formatCurrency(num: number | undefined | null): string {
  return `${formatNumber(num)}원`;
}
