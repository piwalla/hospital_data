/**
 * @file requested-documents.ts
 * @description 병원/회사에 요청해야 하는 서류 데이터
 *
 * 환자가 직접 작성하지 않고, 병원이나 회사에 요청해서 받아야 하는 서류 목록입니다.
 * 서류_정리.md의 "탭 2: 병원이나 회사에 요청해야 하나요?" 기준으로 작성되었습니다.
 */

import type { RequestedDocument } from '@/lib/types/document';

/**
 * 요청 서류 목록
 */
export const REQUESTED_DOCUMENTS: RequestedDocument[] = [
  {
    id: 'medical-opinion-certificate',
    name: '산재용 소견서/진단서',
    source: 'hospital',
    description: '(최초 신청 시) 일반 진단서가 아닙니다. 의사 선생님께 **"산재 신청할 거니 산재용 소견서 써주세요"**라고 해야 합니다.',
    guide: '의사 선생님께 "산재 신청할 거니 산재용 소견서 써주세요"라고 말씀하세요. 일반 진단서와는 다릅니다.',
    requiredStages: ['initial'],
  },
  {
    id: 'medical-records-copy',
    name: '의무기록사본',
    source: 'hospital',
    description: '(최초 신청 시) 초진 차트, 검사 결과지 등 사고 당시의 기록입니다. 원무과에 **"전체 의무기록 복사해주세요"**라고 하세요.',
    guide: '원무과에 "전체 의무기록 복사해주세요"라고 요청하세요. 초진 차트, 검사 결과지 등 사고 당시의 모든 기록이 필요합니다.',
    requiredStages: ['initial'],
  },
  {
    id: 'medical-expense-detail',
    name: '진료비 영수증/상세내역서',
    source: 'hospital',
    description: '(요양비 청구 시) 내가 낸 병원비를 돌려받으려면 필수입니다. 카드 영수증만으로는 안 되고, **"진료비 상세 내역서"**가 꼭 필요해요.',
    guide: '카드 영수증만으로는 안 됩니다. 병원 원무과에 "진료비 상세 내역서"를 요청하세요. 어떤 주사를 맞고 무슨 검사를 했는지 세부 항목이 나온 내역서가 필요합니다.',
    requiredStages: ['treatment'],
  },
  {
    id: 'disability-certificate',
    name: '장해진단서',
    source: 'hospital',
    description: '(장해 청구 시) 치료 종결 후 남은 장해 상태를 의사가 평가한 서류입니다. 대학병원급에서 발급받는 것이 유리할 수 있습니다.',
    guide: '치료 종결 후 주치의에게 장해진단서 발급을 요청하세요. 대학병원급에서 발급받는 것이 유리할 수 있습니다. 의사가 장해 부위 및 상태를 의학적 수치로 기재합니다.',
    requiredStages: ['disability', 'return'],
  },
  {
    id: 'medical-imaging-cd',
    name: 'MRI / X-ray CD',
    source: 'hospital',
    description: '(장해 청구 시) 내 몸의 상태를 증명하는 영상 자료입니다. 영상의학과 데스크에서 CD로 구워달라고 하세요.',
    guide: '영상의학과 데스크에서 CD로 구워달라고 요청하세요. 장해 심사는 말로 하는 것이 아니라 "의학적 근거"로 하므로, 영상 자료가 필수입니다.',
    requiredStages: ['disability', 'return'],
  },
  {
    id: 'employer-confirmation',
    name: '사업주 확인서',
    source: 'company',
    description: '회사 사장님이 "우리 직원이 일하다 다친 게 맞습니다"라고 확인해 주는 서류입니다. (주의: 사장님이 안 써줘도 산재 신청은 가능합니다!)',
    guide: '회사에 사업주 확인서를 요청하세요. 하지만 **사장님이 안 써줘도 산재 신청은 가능합니다!** 최근에는 필수 요소가 아니며, 사업주 날인이 없어도 공단에 제출하면 공단이 알아서 확인합니다.',
    requiredStages: ['initial'],
    isOptional: true,
  },
  {
    id: 'settlement-judgment',
    name: '합의서/판결문',
    source: 'court',
    description: '혹시 회사와 따로 합의금을 받았거나 소송을 했다면, 그 금액만큼 산재 보상금에서 빠지게 됩니다. 중복 보상을 막기 위해 공단이 확인하는 서류입니다.',
    guide: '회사와 따로 합의금을 받았거나 소송을 했다면, 합의서나 판결문 사본을 보관하여 제출하세요. 그 금액만큼 산재 보상금에서 빠지게 됩니다. 중복 보상을 막기 위해 공단이 확인하는 서류입니다.',
    requiredStages: ['all'],
    isOptional: true,
  },
];

/**
 * 발급처별로 그룹화된 요청 서류
 */
export function getRequestedDocumentsBySource(source: RequestedDocument['source']): RequestedDocument[] {
  return REQUESTED_DOCUMENTS.filter((doc) => doc.source === source);
}

/**
 * 단계별로 필터링된 요청 서류
 */
export function getRequestedDocumentsByStage(stage: RequestedDocument['requiredStages'][number]): RequestedDocument[] {
  return REQUESTED_DOCUMENTS.filter(
    (doc) => doc.requiredStages.includes(stage) || doc.requiredStages.includes('all')
  );
}

/**
 * 요청 서류 ID로 찾기
 */
export function findRequestedDocumentById(id: string): RequestedDocument | undefined {
  return REQUESTED_DOCUMENTS.find((doc) => doc.id === id);
}










