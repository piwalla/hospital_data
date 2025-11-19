/**
 * @file documents.ts
 * @description 산재 관련 서류 데이터
 *
 * 주요 산재 서류 8개에 대한 기본 정보를 정의합니다.
 * 각 서류는 AI 요약 가이드 생성 시 사용됩니다.
 */

import type { Document } from '@/lib/types/document';

/**
 * 주요 산재 서류 목록
 */
export const DOCUMENTS: Document[] = [
  {
    id: 'workplace-accident-application',
    name: '산재신청서',
    description: '산업재해 인정을 받기 위한 신청서입니다. 업무상 재해가 발생했을 때 제출합니다.',
    category: 'application',
    officialDownloadUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0301000000',
    exampleUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0301000000',
    requiredDocuments: [
      '의료진단서',
      '재해발생 경위서',
      '재해발생 장소 사진',
      '고용보험 피보험자격 취득확인서',
    ],
    processingPeriod: '30일 이내',
    relatedDocuments: ['medical-benefit-application', 'sick-leave-benefit-application'],
    predefinedSummary: {
      summary:
        '산재신청서는 업무 중 발생한 부상이나 질병을 산업재해로 인정받기 위해 제출하는 서류입니다. 이 서류를 제출하면 근로복지공단에서 해당 사고가 업무상 재해인지 판단하여 인정 여부를 결정합니다. 산재로 인정되면 이후 요양급여, 휴업급여 등 다양한 급여를 받을 수 있습니다.\n\n재해가 발생한 후 가능한 빨리 제출하는 것이 좋습니다. 제출 시 재해 발생 경위, 의료진단서, 사진 등 객관적인 증거 자료를 함께 제출하면 인정 가능성이 높아집니다.',
      sections: [
        {
          title: '재해 발생 일시 및 장소',
          content:
            '재해가 발생한 정확한 날짜, 시간, 장소를 기재합니다. 예를 들어 "2024년 1월 15일 오후 2시 30분, 서울시 강남구 공사 현장 3층"과 같이 구체적으로 작성합니다.',
          order: 1,
        },
        {
          title: '재해 발생 경위',
          content:
            '재해가 어떻게 발생했는지 상세히 설명합니다. 예를 들어 "철골 구조물 설치 중 발판에서 미끄러져 추락하여 허리를 다쳤다"와 같이 구체적인 상황을 기술합니다.',
          order: 2,
        },
        {
          title: '부상 부위 및 증상',
          content:
            '어느 부위를 다쳤는지, 어떤 증상이 있는지 명확히 기재합니다. 의료진단서의 내용과 일치하도록 작성하는 것이 중요합니다.',
          order: 3,
        },
        {
          title: '치료 병원 정보',
          content:
            '치료를 받은 병원의 이름, 주소, 전화번호를 정확히 기재합니다. 여러 병원에서 치료받은 경우 모두 기재합니다.',
          order: 4,
        },
      ],
      importantNotes: [
        '재해 발생 후 3년 이내에 제출해야 합니다. 기한을 놓치면 신청이 불가능할 수 있습니다.',
        '재해 발생 경위서는 사실에 근거하여 정확하게 작성해야 합니다. 허위 기재 시 불이익을 받을 수 있습니다.',
        '의료진단서는 재해 발생 후 가능한 빨리 발급받아야 합니다. 시간이 지날수록 재해와 부상의 인과관계를 입증하기 어려워집니다.',
      ],
    },
  },
  {
    id: 'medical-benefit-application',
    name: '요양급여 신청서',
    description: '산재로 인한 치료비를 지원받기 위한 신청서입니다. 병원 치료비를 보상받을 수 있습니다.',
    category: 'benefit',
    officialDownloadUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0302000000',
    exampleUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0302000000',
    requiredDocuments: [
      '의료비 영수증',
      '진단서',
      '치료비 내역서',
      '산재인정서',
    ],
    processingPeriod: '7-14일',
    relatedDocuments: ['workplace-accident-application', 'medical-benefit-payment-application'],
    predefinedSummary: {
      summary:
        '요양급여 신청서는 산재로 인해 발생한 치료비를 근로복지공단으로부터 지원받기 위해 제출하는 서류입니다. 산재로 인정받은 후 병원에서 치료를 받은 비용을 보상받을 수 있습니다. 입원비, 통원비, 약값, 물리치료비 등 산재 치료와 관련된 모든 의료비가 포함됩니다.\n\n산재인정서를 받은 후 치료를 받은 모든 병원의 영수증을 모아서 신청하면 됩니다. 치료 기간이 길어질 경우 여러 번 신청할 수 있으며, 각 신청마다 해당 기간의 의료비를 보상받을 수 있습니다.',
      sections: [
        {
          title: '치료 기간',
          content:
            '요양급여를 신청하는 기간을 명확히 기재합니다. 예를 들어 "2024년 1월 15일부터 2024년 2월 15일까지"와 같이 시작일과 종료일을 정확히 작성합니다.',
          order: 1,
        },
        {
          title: '치료 병원 정보',
          content:
            '치료를 받은 병원의 이름, 주소, 전화번호를 기재합니다. 여러 병원에서 치료받은 경우 모두 기재합니다.',
          order: 2,
        },
        {
          title: '의료비 내역',
          content:
            '지출한 의료비의 총액을 기재합니다. 영수증의 합계 금액과 일치하도록 작성합니다. 입원비, 통원비, 약값 등을 구분하여 기재하면 더욱 명확합니다.',
          order: 3,
        },
        {
          title: '치료 내용',
          content:
            '받은 치료의 종류를 간단히 기재합니다. 예를 들어 "수술", "물리치료", "약물치료" 등으로 작성합니다.',
          order: 4,
        },
      ],
      importantNotes: [
        '산재인정서를 먼저 받아야 요양급여를 신청할 수 있습니다. 산재 인정 전에 지출한 의료비는 보상받을 수 없습니다.',
        '의료비 영수증은 모두 보관하여 제출해야 합니다. 영수증이 없으면 해당 비용을 보상받을 수 없습니다.',
        '산재 지정 의료기관에서 치료받으면 본인 부담금이 없거나 적습니다. 일반 병원에서 치료받으면 본인 부담금이 발생할 수 있습니다.',
      ],
    },
  },
  {
    id: 'sick-leave-benefit-application',
    name: '휴업급여 신청서',
    description: '치료 기간 중 임금을 보상받기 위한 신청서입니다. 업무를 할 수 없는 기간 동안 급여를 받을 수 있습니다.',
    category: 'benefit',
    officialDownloadUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0303000000',
    exampleUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0303000000',
    requiredDocuments: [
      '의료진단서',
      '소득증명서',
      '휴업기간 확인서',
      '산재인정서',
    ],
    processingPeriod: '7-14일',
    relatedDocuments: ['workplace-accident-application', 'medical-benefit-application'],
    predefinedSummary: {
      summary:
        '휴업급여 신청서는 산재로 인해 치료를 받아 일을 할 수 없는 기간 동안 받을 수 있는 급여를 신청하는 서류입니다. 평소 받던 임금의 일부를 보상받을 수 있어 치료 기간 중 생활비 걱정을 덜 수 있습니다. 휴업급여는 평균임금의 70%를 지급받을 수 있으며, 최대 3년까지 받을 수 있습니다.\n\n치료를 받는 동안 매월 신청할 수 있으며, 의료진단서에 휴업 필요 기간이 명시되어 있어야 합니다. 회사에서 병가를 주지 않거나 무급휴직 상태라면 휴업급여가 더욱 중요합니다.',
      sections: [
        {
          title: '휴업 기간',
          content:
            '일을 할 수 없었던 기간을 명확히 기재합니다. 의료진단서에 명시된 휴업 필요 기간과 일치하도록 작성합니다. 예를 들어 "2024년 1월 15일부터 2024년 2월 15일까지"와 같이 작성합니다.',
          order: 1,
        },
        {
          title: '평균임금',
          content:
            '재해 발생 전 3개월간의 평균 임금을 기재합니다. 소득증명서나 급여명세서를 참고하여 정확한 금액을 작성합니다. 휴업급여는 이 평균임금의 70%를 지급받습니다.',
          order: 2,
        },
        {
          title: '휴업 사유',
          content:
            '왜 일을 할 수 없었는지 간단히 기재합니다. 예를 들어 "허리 디스크 수술 후 회복 기간", "골절 치료로 인한 휴업" 등으로 작성합니다.',
          order: 3,
        },
        {
          title: '치료 병원 정보',
          content:
            '치료를 받은 병원의 이름과 주소를 기재합니다. 의료진단서를 발급받은 병원 정보와 일치하도록 작성합니다.',
          order: 4,
        },
      ],
      importantNotes: [
        '의료진단서에 휴업 필요 기간이 명시되어 있어야 합니다. "휴업 필요" 또는 "근무 불가" 등의 문구가 있어야 신청이 가능합니다.',
        '평균임금 계산이 중요합니다. 잘못 계산하면 받을 수 있는 급여가 줄어들 수 있으니 신중하게 작성해야 합니다.',
        '휴업급여는 치료를 받는 동안 계속 신청할 수 있습니다. 치료가 끝날 때까지 매월 신청하면 됩니다.',
      ],
    },
  },
  {
    id: 'disability-rating-application',
    name: '장해등급 신청서',
    description: '산재로 인한 장애 등급을 판정받기 위한 신청서입니다. 장해 정도에 따라 보상금이 결정됩니다.',
    category: 'compensation',
    officialDownloadUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0304000000',
    exampleUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0304000000',
    requiredDocuments: [
      '의료진단서',
      '장해진단서',
      '치료 종결 확인서',
      '산재인정서',
    ],
    processingPeriod: '30-60일',
    relatedDocuments: ['workplace-accident-application', 'disease-compensation-application'],
    predefinedSummary: {
      summary:
        '장해등급 신청서는 산재로 인한 부상이나 질병이 치료 후에도 남아있는 장해의 정도를 판정받기 위해 제출하는 서류입니다. 장해등급은 1급부터 14급까지 있으며, 등급에 따라 상병보상금의 금액이 결정됩니다. 치료가 완전히 끝난 후에도 신체 기능에 장애가 남아있는 경우 신청할 수 있습니다.\n\n치료가 종결된 후 2년 이내에 신청해야 하며, 장해진단서를 발급받아야 합니다. 장해등급 판정은 근로복지공단에서 전문 의사가 검진을 통해 결정하므로, 정확한 진단서와 치료 경과가 중요합니다.',
      sections: [
        {
          title: '치료 종결 일자',
          content:
            '치료가 끝난 날짜를 기재합니다. 의료진단서나 치료 종결 확인서에 명시된 날짜와 일치하도록 작성합니다. 치료가 완전히 끝나지 않으면 신청할 수 없습니다.',
          order: 1,
        },
        {
          title: '장해 부위 및 내용',
          content:
            '어느 부위에 어떤 장해가 남아있는지 상세히 기재합니다. 예를 들어 "오른팔 관절 운동 범위 제한", "척추 변형으로 인한 통증" 등으로 구체적으로 작성합니다.',
          order: 2,
        },
        {
          title: '장해 정도',
          content:
            '장해진단서에 명시된 장해 정도를 기재합니다. 예를 들어 "관절 운동 범위 50% 제한", "신경 손상으로 인한 감각 저하" 등으로 작성합니다.',
          order: 3,
        },
        {
          title: '일상생활 영향',
          content:
            '장해로 인해 일상생활이나 직업 활동에 어떤 영향을 받는지 기재합니다. 예를 들어 "무거운 물건을 들 수 없음", "장시간 서 있을 수 없음" 등으로 작성합니다.',
          order: 4,
        },
      ],
      importantNotes: [
        '치료가 완전히 종결된 후에만 신청할 수 있습니다. 치료 중에는 신청할 수 없으니 치료가 끝날 때까지 기다려야 합니다.',
        '장해진단서는 산재 지정 의료기관에서 발급받아야 합니다. 일반 병원에서 발급받은 진단서는 인정되지 않을 수 있습니다.',
        '장해등급 판정은 전문 의사의 검진을 통해 결정됩니다. 판정 결과에 이의가 있으면 재심사를 신청할 수 있습니다.',
      ],
    },
  },
  {
    id: 'medical-benefit-payment-application',
    name: '요양급여 지급 신청서',
    description: '추가 치료비를 지원받기 위한 신청서입니다. 기존 요양급여에 추가로 필요한 치료비를 신청합니다.',
    category: 'benefit',
    officialDownloadUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0305000000',
    exampleUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0305000000',
    requiredDocuments: [
      '추가 의료비 영수증',
      '추가 치료 필요 진단서',
      '기존 요양급여 지급 내역',
      '산재인정서',
    ],
    processingPeriod: '7-14일',
    relatedDocuments: ['medical-benefit-application', 'workplace-accident-application'],
    predefinedSummary: {
      summary:
        '요양급여 지급 신청서는 이미 요양급여를 받고 있는 상태에서 추가로 발생한 치료비를 신청하는 서류입니다. 치료가 장기화되거나 추가 치료가 필요한 경우 매월 또는 치료 기간마다 신청할 수 있습니다. 기존 요양급여 신청서와 동일한 방식으로 작성하되, 이전에 신청한 기간 이후의 의료비만 신청하면 됩니다.\n\n치료가 계속되는 동안 정기적으로 신청하여 지속적으로 의료비를 보상받을 수 있습니다. 각 신청마다 해당 기간의 의료비 영수증과 진단서를 제출하면 됩니다.',
      sections: [
        {
          title: '추가 치료 기간',
          content:
            '이전 요양급여 신청 이후 추가로 치료를 받은 기간을 기재합니다. 예를 들어 "2024년 2월 16일부터 2024년 3월 15일까지"와 같이 작성합니다.',
          order: 1,
        },
        {
          title: '이전 요양급여 지급 내역',
          content:
            '이미 받은 요양급여의 지급 내역을 참고하여 기재합니다. 근로복지공단에서 발급받은 지급 내역서를 확인하여 작성합니다.',
          order: 2,
        },
        {
          title: '추가 의료비 내역',
          content:
            '추가로 지출한 의료비의 총액을 기재합니다. 영수증의 합계 금액과 일치하도록 작성하며, 입원비, 통원비, 약값 등을 구분하여 기재합니다.',
          order: 3,
        },
        {
          title: '추가 치료 필요 사유',
          content:
            '왜 추가 치료가 필요한지 간단히 기재합니다. 예를 들어 "수술 후 재활 치료 필요", "만성 통증으로 인한 지속 치료" 등으로 작성합니다.',
          order: 4,
        },
      ],
      importantNotes: [
        '이전 요양급여 신청 기간과 중복되지 않도록 주의해야 합니다. 중복 신청 시 거절될 수 있습니다.',
        '추가 치료가 산재와 관련이 있어야 합니다. 산재와 무관한 다른 질병 치료비는 보상받을 수 없습니다.',
        '의료비 영수증은 모두 보관하여 제출해야 합니다. 영수증이 없으면 해당 비용을 보상받을 수 없습니다.',
      ],
    },
  },
  {
    id: 'disease-compensation-application',
    name: '상병보상금 신청서',
    description: '산재로 인한 장해에 대한 보상금을 받기 위한 신청서입니다. 장해등급에 따라 보상금이 지급됩니다.',
    category: 'compensation',
    officialDownloadUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0306000000',
    exampleUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0306000000',
    requiredDocuments: [
      '장해등급 판정서',
      '소득증명서',
      '장해보상금 계산서',
      '산재인정서',
    ],
    processingPeriod: '14-30일',
    relatedDocuments: ['disability-rating-application', 'workplace-accident-application'],
    predefinedSummary: {
      summary:
        '상병보상금 신청서는 산재로 인한 장해등급을 받은 후 그에 따른 보상금을 지급받기 위해 제출하는 서류입니다. 장해등급에 따라 보상금의 금액이 결정되며, 1급이 가장 높고 14급이 가장 낮습니다. 보상금은 평균임금과 장해등급을 기준으로 계산되며, 일시금으로 지급됩니다.\n\n장해등급 판정을 받은 후 2년 이내에 신청해야 하며, 장해등급 판정서가 있어야 신청할 수 있습니다. 보상금은 장해의 정도와 재해 발생 당시의 임금 수준에 따라 달라지므로, 정확한 소득 증명이 중요합니다.',
      sections: [
        {
          title: '장해등급',
          content:
            '근로복지공단에서 판정받은 장해등급을 기재합니다. 장해등급 판정서에 명시된 등급을 정확히 작성합니다. 예를 들어 "7급", "10급" 등으로 작성합니다.',
          order: 1,
        },
        {
          title: '평균임금',
          content:
            '재해 발생 전 3개월간의 평균 임금을 기재합니다. 소득증명서나 급여명세서를 참고하여 정확한 금액을 작성합니다. 보상금 계산의 기준이 되므로 매우 중요합니다.',
          order: 2,
        },
        {
          title: '보상금 계산',
          content:
            '장해등급과 평균임금을 기준으로 계산된 보상금 금액을 기재합니다. 근로복지공단에서 제공하는 계산표를 참고하여 작성하거나, 담당자에게 문의하여 확인합니다.',
          order: 3,
        },
        {
          title: '장해 내용',
          content:
            '판정받은 장해의 내용을 간단히 기재합니다. 예를 들어 "오른팔 관절 운동 범위 제한", "척추 변형" 등으로 작성합니다.',
          order: 4,
        },
      ],
      importantNotes: [
        '장해등급 판정을 먼저 받아야 상병보상금을 신청할 수 있습니다. 장해등급 신청서를 먼저 제출하고 판정을 받아야 합니다.',
        '보상금은 일시금으로 지급되며, 장해등급에 따라 금액이 크게 달라집니다. 정확한 계산이 중요합니다.',
        '장해등급 판정 후 2년 이내에 신청해야 합니다. 기한을 놓치면 신청이 불가능할 수 있습니다.',
      ],
    },
  },
  {
    id: 'survivor-benefit-application',
    name: '유족급여 신청서',
    description: '산재로 인해 사망한 경우 유족이 받을 수 있는 급여 신청서입니다. 사망한 근로자의 가족이 신청합니다.',
    category: 'compensation',
    officialDownloadUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0307000000',
    exampleUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0307000000',
    requiredDocuments: [
      '사망진단서',
      '가족관계증명서',
      '유족 확인서',
      '산재인정서',
    ],
    processingPeriod: '14-30일',
    relatedDocuments: ['workplace-accident-application', 'funeral-expense-application'],
    predefinedSummary: {
      summary:
        '유족급여 신청서는 산재로 인해 근로자가 사망한 경우, 그 유족(가족)이 받을 수 있는 급여를 신청하는 서류입니다. 사망한 근로자의 배우자, 자녀, 부모 등이 유족으로 인정받을 수 있으며, 유족의 수와 관계에 따라 급여 금액이 결정됩니다. 유족급여는 월 급여 형태로 지급되며, 유족이 사망하거나 일정 연령에 도달할 때까지 지급됩니다.\n\n산재로 인한 사망이 인정되어야 하며, 사망진단서와 가족관계증명서를 통해 유족 관계를 증명해야 합니다. 유족이 여러 명인 경우 대표자를 정하여 신청하거나, 각자 신청할 수 있습니다.',
      sections: [
        {
          title: '사망자 정보',
          content:
            '사망한 근로자의 이름, 주민등록번호, 사망 일시를 기재합니다. 사망진단서의 내용과 일치하도록 작성합니다.',
          order: 1,
        },
        {
          title: '유족 정보',
          content:
            '급여를 받을 유족의 이름, 주민등록번호, 사망자와의 관계를 기재합니다. 가족관계증명서를 참고하여 정확히 작성합니다. 유족이 여러 명인 경우 모두 기재합니다.',
          order: 2,
        },
        {
          title: '사망 원인',
          content:
            '산재로 인한 사망임을 명확히 기재합니다. 예를 들어 "공사 현장 추락 사고로 인한 사망", "화학물질 중독으로 인한 사망" 등으로 작성합니다.',
          order: 3,
        },
        {
          title: '사망자 평균임금',
          content:
            '사망한 근로자의 재해 발생 전 3개월간의 평균 임금을 기재합니다. 유족급여 계산의 기준이 되므로 정확히 작성해야 합니다.',
          order: 4,
        },
      ],
      importantNotes: [
        '산재로 인한 사망이 인정되어야 합니다. 일반 사망과 구분하여 산재 사망으로 인정받아야 유족급여를 받을 수 있습니다.',
        '유족의 범위는 배우자, 자녀, 부모 등으로 제한됩니다. 가족관계증명서로 유족 관계를 증명해야 합니다.',
        '유족급여는 월 급여 형태로 지급되며, 유족이 사망하거나 일정 연령에 도달하면 지급이 중단됩니다.',
      ],
    },
  },
  {
    id: 'funeral-expense-application',
    name: '장의비 신청서',
    description: '산재로 인한 사망 시 장례비를 지원받기 위한 신청서입니다. 장례에 필요한 비용을 보상받을 수 있습니다.',
    category: 'compensation',
    officialDownloadUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0308000000',
    exampleUrl: 'https://www.comwel.or.kr/comwel/comwelBoard.do?menuId=comwel0308000000',
    requiredDocuments: [
      '사망진단서',
      '장의비 영수증',
      '장례비 내역서',
      '산재인정서',
    ],
    processingPeriod: '7-14일',
    relatedDocuments: ['survivor-benefit-application', 'workplace-accident-application'],
    predefinedSummary: {
      summary:
        '장의비 신청서는 산재로 인해 근로자가 사망한 경우, 장례에 소요된 비용을 보상받기 위해 제출하는 서류입니다. 장례비, 관값, 화장비, 묘비 등 장례와 관련된 모든 비용이 포함됩니다. 장의비는 일정 한도 내에서 실제 지출한 금액을 보상받을 수 있으며, 영수증을 제출해야 합니다.\n\n산재로 인한 사망이 인정되어야 하며, 사망 후 가능한 빨리 신청하는 것이 좋습니다. 장의비는 유족급여와 별도로 지급되므로, 두 가지를 모두 신청할 수 있습니다.',
      sections: [
        {
          title: '사망자 정보',
          content:
            '사망한 근로자의 이름, 주민등록번호, 사망 일시를 기재합니다. 사망진단서의 내용과 일치하도록 작성합니다.',
          order: 1,
        },
        {
          title: '장의비 지출 내역',
          content:
            '장례에 지출한 비용의 내역을 상세히 기재합니다. 장례비, 관값, 화장비, 묘비, 제사비 등을 구분하여 작성합니다. 각 항목별 금액과 합계 금액을 명확히 기재합니다.',
          order: 2,
        },
        {
          title: '장의비 총액',
          content:
            '지출한 장의비의 총액을 기재합니다. 영수증의 합계 금액과 일치하도록 작성합니다. 일정 한도 내에서 실제 지출한 금액을 보상받을 수 있습니다.',
          order: 3,
        },
        {
          title: '장례 일자 및 장소',
          content:
            '장례를 치른 날짜와 장소를 기재합니다. 예를 들어 "2024년 1월 20일, 서울추모공원"과 같이 작성합니다.',
          order: 4,
        },
      ],
      importantNotes: [
        '산재로 인한 사망이 인정되어야 합니다. 일반 사망과 구분하여 산재 사망으로 인정받아야 장의비를 보상받을 수 있습니다.',
        '장의비 영수증은 모두 보관하여 제출해야 합니다. 영수증이 없으면 해당 비용을 보상받을 수 없습니다.',
        '장의비는 일정 한도 내에서 실제 지출한 금액을 보상받을 수 있습니다. 한도를 초과하는 부분은 보상받을 수 없습니다.',
      ],
    },
  },
];

/**
 * 서류 ID로 서류 찾기
 */
export function findDocumentById(id: string): Document | undefined {
  return DOCUMENTS.find((doc) => doc.id === id);
}

/**
 * 카테고리별 서류 목록 가져오기
 */
export function getDocumentsByCategory(category: Document['category']): Document[] {
  return DOCUMENTS.filter((doc) => doc.category === category);
}

/**
 * 전체 서류 개수
 */
export const DOCUMENTS_COUNT = DOCUMENTS.length;


