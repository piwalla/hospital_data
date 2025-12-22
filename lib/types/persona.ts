/**
 * @file persona.ts
 * @description 심리 상담 챗봇 페르소나 타입 및 상수 정의
 * 
 * 3가지 페르소나:
 * - 정원 (jungwon): 전문 심리 상담사
 * - 강석 (gangseok): 선배 환자
 * - 미영 (miyoung): 선배 가족
 */

export type PersonaType = 'jungwon' | 'gangseok' | 'miyoung';

export interface PersonaMetadata {
  id: PersonaType;
  name: string;
  role: string;
  oneLiner: string;
  description: string;
  imagePath: string;
}

export const PERSONAS: Record<PersonaType, PersonaMetadata> = {
  jungwon: {
    id: 'jungwon',
    name: '정원',
    role: '전문가',
    oneLiner: '산재 환자의 상황을 이해하는 심리 상담사예요',
    description: '산재 전문 심리 상담사로, 차분하고 신뢰감 있는 따뜻함으로 상담을 제공합니다.',
    imagePath: '/전문가.png',
  },
  gangseok: {
    id: 'gangseok',
    name: '강석',
    role: '선배 환자',
    oneLiner: '막막하지? 나도 그랬어. 근데 나 봐라, 결국 다시 일어섰잖아. 너도 할 수 있어.',
    description: '3년간 산재를 겪고 회복한 선배로, 친근하고 솔직한 경험담을 나눕니다.',
    imagePath: '/선배산재환자.png',
  },
  miyoung: {
    id: 'miyoung',
    name: '미영',
    role: '선배 가족',
    oneLiner: '혼자서 다 짊어지려 하지 마세요. 당신과 가족 모두가 행복해질 수 있게 같이 고민해봐요.',
    description: '3년간 가족을 간호한 선배 보호자로, 부드럽고 세심한 말투로 위로합니다.',
    imagePath: '/선배산재가족.png',
  },
};

export const DEFAULT_PERSONA: PersonaType = 'jungwon';

