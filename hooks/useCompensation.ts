import { useMemo } from 'react';
import { COMPENSATION_CONSTANTS, DISABILITY_GRADE_DAYS } from '@/lib/compensation_data';

export type UserInputs = {
  averageWage: number; // 일 평균임금
  age?: number;        // 나이 (휴업급여 감액 적용용)
  disabilityGrade?: number; // 장해등급 (1~14)
  nursingGrade?: 1 | 2 | 3;  // 간병등급 (요양 중)
};

export const useCompensation = (inputs: UserInputs) => {
  const { averageWage, age, disabilityGrade, nursingGrade } = inputs;

  // 1. 휴업급여 계산 (Temporary Disability)
  const temporaryDisability = useMemo(() => {
    if (!averageWage) return 0;
    
    let dailyAmount = averageWage * COMPENSATION_CONSTANTS.TEMPORARY.RATE;

    // 상한/하한 적용
    if (dailyAmount > COMPENSATION_CONSTANTS.TEMPORARY.MAX_DAILY) {
      dailyAmount = COMPENSATION_CONSTANTS.TEMPORARY.MAX_DAILY;
    }
    if (dailyAmount < COMPENSATION_CONSTANTS.TEMPORARY.MIN_DAILY) {
       // 평균임금 자체가 최저임금보다 낮은 경우 평균임금 적용 (예외 규칙) 등은 단순화를 위해 생략하되,
       // 일반적인 하한액 적용. 단, 평균임금 < 최저보상 이면 최저보상 적용.
       // (실무적으로는 본인의 평균임금이 최저임금 미만이면 평균임금 적용이나, 여기선 일반 가이드로 하한선 안내)
       dailyAmount = COMPENSATION_CONSTANTS.TEMPORARY.MIN_DAILY;
    }

    // 고령자 감액 (61세 이상) - 연구 문서 규칙 적용
    if (age && age >= 61) {
      const reductions: Record<number, number> = {
        61: 66/70, 62: 62/70, 63: 58/70, 64: 54/70, 65: 50/70
      };
      // 65세 이상은 모두 50/70
      const ratio = age >= 65 ? (50/70) : (reductions[age] || 1);
      dailyAmount = dailyAmount * ratio;
    }

    return Math.floor(dailyAmount); // 원 단위 절사
  }, [averageWage, age]);


  // 2. 장해급여 계산 (Disability Benefit)
  const disabilityBenefit = useMemo(() => {
    if (!averageWage || !disabilityGrade) return null;
    
    const gradeInfo = DISABILITY_GRADE_DAYS.find(g => g.grade === disabilityGrade);
    if (!gradeInfo) return null;

    return {
      type: gradeInfo.type, // PENSION_ONLY, CHOICE, LUMPSUM_ONLY
      days: gradeInfo.lumpSum || gradeInfo.pension, // 대표 일수 (일시금 기준 우선 표시)
      amount: Math.floor(averageWage * (gradeInfo.lumpSum || (gradeInfo.pension! * 1))), // 단순 예시용 (일시금 총액)
      pensionYearly: gradeInfo.pension ? Math.floor(averageWage * gradeInfo.pension) : null,
      lumpSumAmount: gradeInfo.lumpSum ? Math.floor(averageWage * gradeInfo.lumpSum) : null,
    };
  }, [averageWage, disabilityGrade]);


  // 3. 간병료 예측 (Nursing Fee - Professional Grade 1 as Max example)
  // 요양 중 최대치(1등급 전문간병)와 최소치(3등급 가족간병) 예시 보여주기
  const nursingFeeRange = useMemo(() => {
    return {
        max: COMPENSATION_CONSTANTS.NURSING_TREATMENT.PROFESSIONAL.GRADE_1,
        min: COMPENSATION_CONSTANTS.NURSING_TREATMENT.FAMILY.GRADE_3,
    }
  }, []);

  // 4. 장의비 (Funeral)
  const funeralExpenses = useMemo(() => {
    if (!averageWage) return null;
    let amount = averageWage * COMPENSATION_CONSTANTS.FUNERAL.DAYS; // 120일분
    
    // 최고/최저 고시액 적용
    if (amount > COMPENSATION_CONSTANTS.FUNERAL.MAX_AMOUNT) amount = COMPENSATION_CONSTANTS.FUNERAL.MAX_AMOUNT;
    if (amount < COMPENSATION_CONSTANTS.FUNERAL.MIN_AMOUNT) amount = COMPENSATION_CONSTANTS.FUNERAL.MIN_AMOUNT;

    return Math.floor(amount);
  }, [averageWage]);

  // 5. 유족급여 예측 (Survivor Benefit)
  const survivorBenefit = useMemo(() => {
    if (!averageWage) return null;
    
    // 기본 연금: 급여기초연액(평균임금*365)의 47% + 가산금(최대 20%)
    // 여기서는 기본 47%와 최대 67% 범위를 보여줌
    const yearlyBase = averageWage * 365;
    
    return {
      minPensionMonthly: Math.floor((yearlyBase * 0.47) / 12), // 기본
      maxPensionMonthly: Math.floor((yearlyBase * 0.67) / 12), // 유족 가산 최대
    };
  }, [averageWage]);

  return {
    temporaryDisability, // 1일 예상 수령액
    disabilityBenefit,   // 장해 등급별 예상액 객체
    nursingFeeRange,     // 간병료 범위
    funeralExpenses,     // 장의비 예상액
    survivorBenefit,     // 유족보상연금 (월)
  };
};
