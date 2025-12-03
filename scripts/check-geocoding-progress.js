/**
 * 약국 지오코딩 진행 상황 확인 스크립트
 */

const http = require('http');

http.get('http://localhost:3000/api/pharmacies/status', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const status = JSON.parse(data);
      const total = status.savedCount || 0;
      const geocoded = total - (status.estimatedNextPage - 1) * 100;
      const remaining = total - geocoded;
      const progress = total > 0 ? Math.round((geocoded / total) * 100) : 0;
      
      console.log('📊 약국 지오코딩 진행 상황');
      console.log('='.repeat(50));
      console.log(`총 약국 데이터: ${total.toLocaleString()}개`);
      console.log(`지오코딩 완료: 약 ${geocoded.toLocaleString()}개`);
      console.log(`남은 데이터: 약 ${remaining.toLocaleString()}개`);
      console.log(`진행률: ${progress}%`);
      console.log('='.repeat(50));
    } catch (e) {
      console.log('상태 확인 실패:', data);
    }
  });
}).on('error', (e) => {
  console.error('오류:', e.message);
});







