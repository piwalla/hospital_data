export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  joinedAt: string;
  lastLoginAt: string;
  currentStep: number; // 0-4
  progress: number; // 0-100%
  location?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'login' | 'view_page' | 'download_doc' | 'search_hospital' | 'start_chat' | 'complete_step';
  details: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning';
}

export const MOCK_USERS: AdminUser[] = [
  {
    id: "user-1",
    name: "홍길동",
    email: "hong@example.com",
    role: "user",
    status: "active",
    joinedAt: "2024-12-01T09:00:00Z",
    lastLoginAt: "2024-12-23T10:30:00Z",
    currentStep: 2,
    progress: 45,
    location: "서울시 강남구",
  },
  {
    id: "user-2",
    name: "김철수",
    email: "kim@example.com",
    role: "user",
    status: "active",
    joinedAt: "2024-12-10T14:20:00Z",
    lastLoginAt: "2024-12-22T16:00:00Z",
    currentStep: 1,
    progress: 20,
    location: "경기도 수원시",
  },
  {
    id: "user-3",
    name: "이영희",
    email: "lee@example.com",
    role: "user",
    status: "inactive",
    joinedAt: "2024-11-20T11:00:00Z",
    lastLoginAt: "2024-12-01T09:00:00Z",
    currentStep: 0,
    progress: 0,
    location: "인천시",
  },
  // Add more mock users as needed
];

export const MOCK_ACTIVITY_LOGS: Record<string, ActivityLog[]> = {
  "user-1": [
    { id: "log-1", userId: "user-1", action: "login", details: "로그인 성공", timestamp: "2024-12-23T10:30:00Z", severity: "info" },
    { id: "log-2", userId: "user-1", action: "view_page", details: "타임라인 Step 2 페이지 조회", timestamp: "2024-12-23T10:32:00Z", severity: "info" },
    { id: "log-3", userId: "user-1", action: "search_hospital", details: "정형외과 검색 (강남구)", timestamp: "2024-12-23T10:35:00Z", severity: "info" },
    { id: "log-4", userId: "user-1", action: "start_chat", details: "문의하기 채팅방 입장", timestamp: "2024-12-23T10:40:00Z", severity: "warning" },
  ],
  "user-2": [
    { id: "log-5", userId: "user-2", action: "login", details: "로그인 성공", timestamp: "2024-12-22T16:00:00Z", severity: "info" },
    { id: "log-6", userId: "user-2", action: "download_doc", details: "요양급여신청서 다운로드", timestamp: "2024-12-22T16:05:00Z", severity: "success" },
  ],
};

export function getActivityLogs(userId: string): ActivityLog[] {
  return MOCK_ACTIVITY_LOGS[userId] || [];
}

export function getUser(userId: string): AdminUser | undefined {
  return MOCK_USERS.find(user => user.id === userId);
}

export interface CSSession {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: string;
  status: 'open' | 'pending' | 'closed';
  unreadCount: number;
  tags: string[];
}

export interface CSMessage {
  id: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'admin';
  createdAt: string;
}

export const MOCK_CS_SESSIONS: CSSession[] = [
  {
    id: "session-1",
    userId: "user-1",
    userName: "홍길동",
    lastMessage: "산재 신청 서류가 어디 있나요?",
    lastMessageAt: "2024-12-23T10:42:00Z",
    status: "open",
    unreadCount: 1,
    tags: ["서류문의", "Step1"],
  },
  {
    id: "session-2",
    userId: "user-2",
    userName: "김철수",
    lastMessage: "병원 찾기 기능이 안 돼요.",
    lastMessageAt: "2024-12-22T16:10:00Z",
    status: "pending",
    unreadCount: 0,
    tags: ["버그제보", "기술지원"],
  },
  {
    id: "session-3",
    userId: "user-3",
    userName: "이영희",
    lastMessage: "감사합니다. 해결되었어요.",
    lastMessageAt: "2024-12-01T09:30:00Z",
    status: "closed",
    unreadCount: 0,
    tags: ["일반문의"],
  },
];

export const MOCK_CS_MESSAGES: Record<string, CSMessage[]> = {
  "session-1": [
    { id: "msg-1", sessionId: "session-1", content: "안녕하세요, 문의드릴 게 있습니다.", sender: "user", createdAt: "2024-12-23T10:40:00Z" },
    { id: "msg-2", sessionId: "session-1", content: "산재 신청 서류가 어디 있나요?", sender: "user", createdAt: "2024-12-23T10:42:00Z" },
  ],
  "session-2": [
    { id: "msg-3", sessionId: "session-2", content: "병원 찾기 지도 로딩이 안 됩니다.", sender: "user", createdAt: "2024-12-22T16:05:00Z" },
    { id: "msg-4", sessionId: "session-2", content: "확인해 보겠습니다. 잠시만요.", sender: "admin", createdAt: "2024-12-22T16:08:00Z" },
    { id: "msg-5", sessionId: "session-2", content: "병원 찾기 기능이 안 돼요.", sender: "user", createdAt: "2024-12-22T16:10:00Z" },
  ],
};
