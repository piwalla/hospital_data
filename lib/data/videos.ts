// 리워크케어 유튜브 영상 데이터
// 17개 영상을 단계별로 매핑하고 개인화 추천을 위한 메타데이터 포함

export interface VideoData {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  stage: number; // 1~4
  priority: number; // 낮을수록 우선순위 높음 (1이 최우선)
  tags: string[];
  targetRole?: 'patient' | 'family'; // 특정 역할 대상
  targetInjury?: ('hand_arm' | 'foot_leg' | 'spine' | 'brain_neuro' | 'other')[]; // 특정 부상 부위 대상
  duration?: string; // 영상 길이
  badge?: 'critical' | 'recommended' | 'optional'; // UI 배지
}

export const REWORK_CARE_VIDEOS: VideoData[] = [
  // ===== 1단계: 산재 신청 및 승인 =====
  {
    id: 'video-16',
    youtubeId: 'anLDxaAFQAk',
    title: '복잡한 산재 신청, 영상으로 확인하세요',
    description: '',
    stage: 1,
    priority: 1,
    tags: ['산재신청가이드', '공상처리', '조사단계'],
    badge: 'critical',
    duration: '8:32',
  },
  {
    id: 'video-4',
    youtubeId: 'FlSxnNFUctI',
    title: '승인받는 산재 사고 경위서 작성법',
    description: '승인율 80%를 결정하는 핵심 요소',
    stage: 1,
    priority: 2,
    tags: ['사고경위서', '산재승인전략', '증거수집'],
    badge: 'critical',
    duration: '6:15',
  },
  {
    id: 'video-3',
    youtubeId: 'jR6CJS-GPYM',
    title: '산재신청서 진행하는 방법',
    description: '회사 도장 없이도 신청 가능',
    stage: 1,
    priority: 3,
    tags: ['요양급여신청서', '산재신청', '회사도장불필요'],
    badge: 'recommended',
    duration: '5:42',
  },
  {
    id: 'video-5',
    youtubeId: 'Xbs-egOZODs',
    title: '요양비 청구하는 방법',
    description: '승인 전 본인이 낸 병원비 환급받기',
    stage: 1,
    priority: 4,
    tags: ['요양비청구', '병원비환급', '상세내역서'],
    badge: 'recommended',
    duration: '4:28',
  },
  {
    id: 'video-17',
    youtubeId: 'r433_ZwERkc',
    title: '산재 진행 절차 한번에 알아보기',
    description: '신청부터 복귀까지 전체 로드맵',
    stage: 1,
    priority: 5,
    tags: ['산재로드맵', '전체과정', '7급연금'],
    badge: 'optional',
    duration: '7:18',
  },

  // ===== 2단계: 요양 및 치료 =====
  {
    id: 'video-6',
    youtubeId: '0HbIaykVjuE',
    title: '산재 휴업급여 완벽 가이드',
    description: '평균 임금 70% 받기 + 압류 방지 통장',
    stage: 2,
    priority: 1,
    tags: ['휴업급여', '평균임금70', '압류방지통장'],
    badge: 'critical',
    duration: '9:15',
  },
  {
    id: 'video-11',
    youtubeId: 'WOKhzBSA3Ks',
    title: '산재 치료 과정에서 필요한 정보',
    description: '승인 직후 대응 매뉴얼',
    stage: 2,
    priority: 2,
    tags: ['산재승인후', '치료계획', '비급여'],
    badge: 'critical',
    duration: '6:52',
  },
  {
    id: 'video-1',
    youtubeId: '9-g7nEpciX8',
    title: '산재 간병비(간병료, 간병급여) 신청 방법',
    description: '가족 간병 시 월 120만 원 받기',
    stage: 2,
    priority: 3,
    tags: ['산재간병비', '가족간병', '간병급여'],
    targetRole: 'family',
    targetInjury: ['brain_neuro', 'spine'],
    badge: 'recommended',
    duration: '7:03',
  },
  {
    id: 'video-2',
    youtubeId: 'DQAkybxo_tU',
    title: '산재 병행진료 A to Z 완벽 가이드',
    description: '치과, MRI, 양한방 병행 치료',
    stage: 2,
    priority: 4,
    tags: ['병행진료', '산재치료비', '양한방병행'],
    targetInjury: ['spine'],
    badge: 'recommended',
    duration: '8:21',
  },
  {
    id: 'video-12',
    youtubeId: 'VHRNwwlyofg',
    title: '산재 이송비, 교통비 청구',
    description: '통원 교통비 실비 지원',
    stage: 2,
    priority: 5,
    tags: ['산재교통비', '이송비', '택시비청구'],
    targetRole: 'family',
    badge: 'optional',
    duration: '5:17',
  },
  {
    id: 'video-10',
    youtubeId: 'nACOx3HUrQo',
    title: '산재 병원 전원 방법',
    description: '병원 옮길 때 주의사항',
    stage: 2,
    priority: 6,
    tags: ['산재전원', '병원옮기기', '사전승인'],
    badge: 'optional',
    duration: '4:55',
  },
  {
    id: 'video-13',
    youtubeId: 'jMoLI-J-yOc',
    title: '산재 추가상병 신청 방법',
    description: '새로 발견된 부위 추가하기',
    stage: 2,
    priority: 7,
    tags: ['추가상병', '파생상병', '인과관계'],
    badge: 'optional',
    duration: '6:38',
  },

  // ===== 3단계: 장해 심사 =====
  {
    id: 'video-7',
    youtubeId: 'ySscSsc_Fwc',
    title: '산재 장해급여 완전정복',
    description: '연금/일시금 선택 전략',
    stage: 3,
    priority: 1,
    tags: ['장해급여', '장해등급', '연금선택'],
    badge: 'critical',
    duration: '10:42',
  },
  {
    id: 'video-15',
    youtubeId: 'ufCjFjOiJ1Y',
    title: '산재 종결과 장해 등급 판정받는 방법',
    description: '산재 전용 기준 적용의 중요성',
    stage: 3,
    priority: 2,
    tags: ['장해등급판정', '산재기준', '소멸시효5년'],
    badge: 'critical',
    duration: '8:27',
  },
  {
    id: 'video-14',
    youtubeId: 'X0YvR1RI08g',
    title: '산재 치료 종결, 그 다음은?',
    description: '불복 청구와 민사 소송 소멸시효',
    stage: 3,
    priority: 3,
    tags: ['치료종결', '불복청구', '민사소송'],
    badge: 'recommended',
    duration: '7:54',
  },
  {
    id: 'video-9',
    youtubeId: 'WFXtyGiqblA',
    title: '산재 재요양 알아야 할 모든 것',
    description: '증상 재발 시 다시 치료받기',
    stage: 3,
    priority: 4,
    tags: ['재요양', '증상악화', '금속핀제거'],
    badge: 'optional',
    duration: '6:19',
  },

  // ===== 4단계: 직업 복귀 =====
  {
    id: 'video-8',
    youtubeId: 'Bm3NDCfLi1I',
    title: '산재 종결 후 재취업 지원 받는 방법',
    description: '최대 600만 원 직업 훈련비',
    stage: 4,
    priority: 1,
    tags: ['재취업지원', '직업훈련', '산재종결'],
    badge: 'critical',
    duration: '9:08',
  },
  {
    id: 'video-9-dup',
    youtubeId: 'WFXtyGiqblA',
    title: '산재 재요양 알아야 할 모든 것',
    description: '복귀 후 증상 악화 대비',
    stage: 4,
    priority: 2,
    tags: ['재요양', '증상악화', '금속핀제거'],
    badge: 'recommended',
    duration: '6:19',
  },
  {
    id: 'video-14-dup',
    youtubeId: 'X0YvR1RI08g',
    title: '산재 치료 종결, 그 다음은?',
    description: '민사 소송 가능성 검토',
    stage: 4,
    priority: 3,
    tags: ['치료종결', '불복청구', '민사소송'],
    badge: 'optional',
    duration: '7:54',
  },
];

// 추천 알고리즘
export function getRecommendedVideos(
  stage: number,
  userRole?: 'patient' | 'family',
  injuryPart?: 'hand_arm' | 'foot_leg' | 'spine' | 'brain_neuro' | 'other',
  maxCount: number = 2
): VideoData[] {
  // 1. 해당 단계의 영상 필터링
  const stageVideos = REWORK_CARE_VIDEOS.filter(v => v.stage === stage);

  // 2. 개인화 점수 계산
  const scoredVideos = stageVideos.map(video => {
    let score = video.priority * 100; // 기본 점수 (낮을수록 높은 우선순위)

    // 역할 매칭 보너스 (-50점 = 우선순위 상승)
    if (userRole && video.targetRole === userRole) {
      score -= 50;
    }

    // 부상 부위 매칭 보너스 (-30점)
    if (injuryPart && video.targetInjury?.includes(injuryPart)) {
      score -= 30;
    }

    return { ...video, score };
  });

  // 3. 점수순 정렬 (낮은 점수가 먼저)
  scoredVideos.sort((a, b) => a.score - b.score);

  // 4. 상위 N개 반환
  return scoredVideos.slice(0, maxCount);
}

// 유튜브 썸네일 URL 생성
export function getYoutubeThumbnail(youtubeId: string, quality: 'default' | 'medium' | 'high' = 'medium'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
  };
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}.jpg`;
}

// 배지 스타일 매핑
export function getBadgeStyle(badge?: 'critical' | 'recommended' | 'optional') {
  switch (badge) {
    case 'critical':
      return {
        icon: '🔥',
        text: '도움 되는 영상',
        className: 'bg-red-100 text-red-700 border-red-200',
      };
    case 'recommended':
      return {
        icon: '⭐',
        text: '강력 추천',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      };
    case 'optional':
      return {
        icon: '💡',
        text: '참고',
        className: 'bg-gray-100 text-gray-600 border-gray-200',
      };
    default:
      return null;
  }
}
