/**
 * @file counseling-content.ts
 * @description 심리 상담 페이지용 음악 및 영상 콘텐츠 데이터
 *
 * 산재 환자의 심리적 부담감 완화를 위한 릴렉스 음악과 기분전환 영상을 관리합니다.
 */

export interface CounselingContent {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: 'music' | 'video';
  tags?: string[];
}

/**
 * 릴렉스 음악 및 힐링 콘텐츠
 */
export const RELAXATION_MUSIC: CounselingContent[] = [
  {
    id: 'relax-music-1',
    title: '명상 음악',
    description: '마음을 진정시키는 부드러운 명상 음악',
    youtubeUrl: 'https://www.youtube.com/watch?v=jgpJVI3tDbY',
    category: 'music',
    tags: ['명상', '휴식', '마음챙김'],
  },
  {
    id: 'relax-music-2',
    title: '자연 소리',
    description: '숲속 새소리와 물소리로 편안함을 느껴보세요',
    youtubeUrl: 'https://www.youtube.com/watch?v=4POz8xVYfUc',
    category: 'music',
    tags: ['자연', '백색소음', '집중'],
  },
  {
    id: 'relax-music-3',
    title: '힐링 음악',
    description: '스트레스 해소에 도움이 되는 힐링 음악',
    youtubeUrl: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    category: 'music',
    tags: ['힐링', '스트레스 해소', '편안함'],
  },
];

/**
 * 기분전환 영상 콘텐츠
 */
export const MOOD_BOOST_VIDEOS: CounselingContent[] = [
  {
    id: 'mood-video-1',
    title: '웃음 유발 영상',
    description: '기분을 전환시켜주는 재미있는 영상',
    youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    category: 'video',
    tags: ['웃음', '기분전환', '유머'],
  },
  {
    id: 'mood-video-2',
    title: '동물 영상',
    description: '귀여운 동물들로 하루의 피로를 풀어보세요',
    youtubeUrl: 'https://www.youtube.com/watch?v=3dcli9i_pvA',
    category: 'video',
    tags: ['동물', '귀여움', '힐링'],
  },
  {
    id: 'mood-video-3',
    title: '자연 풍경 영상',
    description: '아름다운 자연 풍경으로 마음을 달래보세요',
    youtubeUrl: 'https://www.youtube.com/watch?v=1La4QzGeaaQ',
    category: 'video',
    tags: ['자연', '풍경', '평온'],
  },
];

/**
 * 전체 콘텐츠 목록
 */
export const ALL_COUNSELING_CONTENT: CounselingContent[] = [
  ...RELAXATION_MUSIC,
  ...MOOD_BOOST_VIDEOS,
];

/**
 * 카테고리별 콘텐츠 가져오기
 */
export function getContentByCategory(category: 'music' | 'video'): CounselingContent[] {
  return ALL_COUNSELING_CONTENT.filter((content) => content.category === category);
}

