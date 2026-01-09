/**
 * 커뮤니티 카테고리 상수 및 유틸리티
 */

import { InjuryType, RegionType, CategoryType } from '@/lib/types/community';

// 부상 유형 정의
export const INJURY_TYPES: Record<InjuryType, string> = {
  fracture: '골절',
  nerve: '신경 손상',
  burn: '화상',
  amputation: '절단',
  other: '기타',
};

// 지역 정의
export const REGIONS: Record<RegionType, string> = {
  metropolitan: '수도권',
  non_metropolitan: '비수도권',
};

// 카테고리 정의
export const CATEGORIES: Record<CategoryType, string> = {
  injury: '부상 유형별',
  region: '지역별',
  anonymous: '익명 게시판',
};

// 부상 유형 아이콘 (이모지 제거됨)
export const INJURY_ICONS: Record<InjuryType, string> = {
  fracture: '',
  nerve: '',
  burn: '',
  amputation: '',
  other: '',
};

// 지역 아이콘 (이모지 제거됨)
export const REGION_ICONS: Record<RegionType, string> = {
  metropolitan: '',
  non_metropolitan: '',
};

// 부상 유형 설명
export const INJURY_DESCRIPTIONS: Record<InjuryType, string> = {
  fracture: '뼈가 부러진 경우',
  nerve: '신경계 손상',
  burn: '화상 및 열상',
  amputation: '신체 일부 절단',
  other: '위 분류에 속하지 않는 부상',
};

// 지역 설명
export const REGION_DESCRIPTIONS: Record<RegionType, string> = {
  metropolitan: '서울, 경기, 인천',
  non_metropolitan: '그 외 모든 지역',
};

// 유틸리티 함수
export function getInjuryLabel(type: InjuryType): string {
  return INJURY_TYPES[type] || '알 수 없음';
}

export function getRegionLabel(type: RegionType): string {
  return REGIONS[type] || '알 수 없음';
}

export function getCategoryLabel(category: CategoryType): string {
  return CATEGORIES[category] || '알 수 없음';
}

export function getInjuryIcon(type: InjuryType): string {
  return INJURY_ICONS[type] || '🏥';
}

export function getRegionIcon(type: RegionType): string {
  return REGION_ICONS[type] || '📍';
}

// 사용자의 지역을 기반으로 RegionType 반환
export function getUserRegionType(region: string): RegionType {
  const metropolitanRegions = ['서울', '경기', '인천', 'seoul', 'gyeonggi', 'incheon'];
  return metropolitanRegions.includes(region) ? 'metropolitan' : 'non_metropolitan';
}

// 사용자의 부상 부위를 기반으로 InjuryType 반환
export function getUserInjuryType(injuryPart: string): InjuryType {
  // 기존 injuryPart 값을 새로운 InjuryType으로 매핑
  const mapping: Record<string, InjuryType> = {
    hand_arm: 'fracture', // 손/팔 부상은 주로 골절
    foot_leg: 'fracture', // 발/다리 부상도 주로 골절
    spine: 'nerve', // 척추는 신경 손상
    brain_neuro: 'nerve', // 뇌/신경은 신경 손상
  };
  
  return mapping[injuryPart] || 'other';
}

export interface BoardGuideline {
  purpose: string;
  allowed: string[];
  forbidden: string[];
}

export const BOARD_GUIDELINES: Record<string, BoardGuideline> = {
  injury: {
    purpose: '동일한 부상을 입은 동료들과 치료 및 재활 정보를 공유하는 공간입니다.',
    allowed: [
      '구체적인 치료 과정 및 재활 운동법 공유',
      '통증 관리 노하우 및 병원 진료 후기',
      '산재 요양 기간 연장 등 행정 절차 경험'
    ],
    forbidden: [
      '검증되지 않은 민간요법 권유',
      '특정 병원/의료진에 대한 악의적 비방',
      '의약품/의료기기 개인 간 거래 및 홍보'
    ]
  },
  region: {
    purpose: '거주 지역의 산재 처리 경험과 유용한 정보를 나누는 공간입니다.',
    allowed: [
      '우리 지역 산재 관련 기관 이용 후기',
      '지역 근로복지공단 지사 처리 경향 공유',
      '지역 기반 자조 모임 및 정보 교류'
    ],
    forbidden: [
      '지역 차별적 발언 및 비하',
      '정치적/종교적 논쟁 조장',
      '상업적 홍보 및 도배'
    ]
  },
  anonymous: {
    purpose: '실명으로 말하기 힘든 고민과 속마음을 솔직하게 털어놓는 대나무숲입니다.',
    allowed: [
      '직장 내 괴롭힘, 산재 은폐 시도 등 고충 토로',
      '사고 트라우마 및 우울감 등 심리적 어려움',
      '복잡한 가정사나 경제적 문제 상담'
    ],
    forbidden: [
      '특정인 실명 거론 및 특정할 수 있는 정보 포함 (명예훼손 주의)',
      '지나친 욕설, 혐오 표현, 인신공격',
      '허위 사실 유포 및 분란 조장'
    ]
  }
};
