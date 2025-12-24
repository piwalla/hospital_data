
export interface NoticePost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  viewCount: number;
  isImportant: boolean; // 상단 고정 여부
  category: '공지' | '점검' | '이벤트';
}

export const MOCK_NOTICES: NoticePost[] = [
  {
    id: "notice-1",
    title: "[공지] 산재 환자 지원 플랫폼 '리워크케어' 정식 오픈 안내",
    content: `
안녕하세요, 리워크케어(ReWorkCare) 운영팀입니다.

산재 근로자 여러분의 재활과 사회 복귀를 돕기 위한 통합 지원 플랫폼 '리워크케어'가 정식 오픈했습니다.

### 주요 기능
1. **병원 찾기**: 내 위치 기반 산재 지정 의료기관 검색
2. **산재 신청 가이드**: 단계별 맞춤형 산재 신청 절차 안내
3. **커뮤니티**: 환자 및 가족들과의 소통 공간 (오픈 예정)

앞으로도 더 나은 서비스를 제공하기 위해 노력하겠습니다.
감사합니다.
    `,
    author: "관리자",
    createdAt: "2024-12-01T09:00:00Z",
    viewCount: 1250,
    isImportant: true,
    category: "공지"
  },
  {
    id: "notice-2",
    title: "[점검] 서버 안정화를 위한 정기 점검 안내 (12/25)",
    content: `
안녕하세요. 12월 25일 새벽 2시부터 4시까지 서버 안정화 작업이 진행될 예정입니다.
작업 시간에는 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.
    `,
    author: "관리자",
    createdAt: "2024-12-20T14:00:00Z",
    viewCount: 340,
    isImportant: false,
    category: "점검"
  },
  {
    id: "notice-3",
    title: "산재 신청 서류 작성법 무료 특강 안내",
    content: "산재 신청 서류 작성이 어려우신가요? 이번 주 토요일 온라인 특강에 참여해보세요...",
    author: "관리자",
    createdAt: "2024-12-15T11:30:00Z",
    viewCount: 890,
    isImportant: false,
    category: "이벤트"
  }
];

export function getNotice(id: string): NoticePost | undefined {
  return MOCK_NOTICES.find(n => n.id === id);
}
