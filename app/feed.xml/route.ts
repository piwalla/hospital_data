import { getPosts } from '@/lib/api/community-posts';

export async function GET() {
  const baseUrl = 'https://www.reworkcare.com';
  
  // 최신 게시글 20개 가져오기
  const { posts } = await getPosts({ limit: 20 });
  
  // RSS XML 헤더
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>리워크케어 - 산재 정보 커뮤니티</title>
  <link>${baseUrl}</link>
  <description>산재 근로자를 위한 정보 공유 및 소통 공간입니다.</description>
  <language>ko</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />`;

  // 게시글 아이템 생성
  const items = posts.map((post) => {
    const postUrl = `${baseUrl}/community/post/${post.id}`;
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${post.content.substring(0, 300)}${post.content.length > 300 ? '...' : ''}]]></description>
      <category>${post.category}</category>
      <author>${post.author_name}</author>
    </item>`;
  }).join('');

  // XML 푸터
  const xmlFooter = `
</channel>
</rss>`;

  return new Response(xmlHeader + items + xmlFooter, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
