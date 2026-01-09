// 단계별 핵심 주의사항 (최대 3개, 간결한 문구)
// 데이터베이스를 건드리지 않고 프론트엔드에서 관리

export type WarningType = 'alert' | 'camera' | 'check' | 'money' | 'ban' | 'hospital' | 'file' | 'clock' | 'job' | 'refresh' | 'scale';

export interface StageWarning {
  type: WarningType;
  title: string;
  description: string;
}

export const STAGE_WARNINGS: Record<number, StageWarning[]> = {
  // 1단계: 산재 신청 및 승인
  1: [
    {
      type: 'alert',
      title: '진료 시 "일하다 다쳤음" 말하기',
      description: '의무기록에 남아야 합니다. **산재보험 처리**를 요청하세요.',
    },
    {
      type: 'camera',
      title: '현장 사진·목격자 확보',
      description: '치우기 전에 찍으세요. **증거**가 없으면 불리합니다.',
    },
    {
      type: 'check',
      title: '회사 동의 없이 신청 가능',
      description: '사업주 날인 불필요합니다. **공상 처리**는 거절하세요.',
    },
  ],

  // 2단계: 요양 및 치료
  2: [
    {
      type: 'money',
      title: '휴업급여 필수',
      description: '매월 청구하지 않으면 받을 수 없습니다. 잊지 말고 신청하세요.',
    },
    {
      type: 'ban',
      title: '무단 근로 금지',
      description: '치료 중 일하다 적발되면 급여가 환수됩니다.',
    },
    {
      type: 'hospital',
      title: '치료 계획 변경 시',
      description: '병원 전원, 병행진료 등은 반드시 공단 승인을 받아야 합니다.',
    },
  ],

  // 3단계: 장해 심사
  3: [
    {
      type: 'file',
      title: '산재 전용 기준',
      description: '일반 진단서가 아닌 "산재 장해진단서"를 받아야 등급이 정확합니다.',
    },
    {
      type: 'camera',
      title: '영상 자료 필수',
      description: 'MRI, X-ray CD 없이는 심사가 불가능합니다. 반드시 제출하세요.',
    },
    {
      type: 'clock',
      title: '소멸시효 5년',
      description: '치료 종결 후 5년 이내 청구하지 않으면 권리가 소멸됩니다.',
    },
  ],

  // 4단계: 직업 복귀
  4: [
    {
      type: 'job',
      title: '직업 훈련비 600만 원',
      description: '재취업 지원 프로그램을 신청하면 훈련비와 수당을 받을 수 있습니다.',
    },
    {
      type: 'refresh',
      title: '재요양 가능',
      description: '복귀 후 증상이 악화되면 다시 산재로 치료받을 수 있습니다.',
    },
    {
      type: 'scale',
      title: '민사 소송 시효',
      description: '회사 대상 손해배상은 3년, 원청 대상은 10년 이내 제기해야 합니다.',
    },
  ],
};

// 특정 단계의 주의사항 가져오기
export function getStageWarnings(stage: number): StageWarning[] {
  return STAGE_WARNINGS[stage] || [];
}
