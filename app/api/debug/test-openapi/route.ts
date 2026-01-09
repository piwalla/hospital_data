import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const serviceKey = 'aba6428813f7272c3d7a7918ec194233d0862839e5d1df1df223f03e1d01592a';
  // Use the decoded key if the library/fetch handles encoding, or encode it manually if needed.
  // Usually for query params in fetch, we need to be careful.
  // Let's try passing it directly first. 
  // Should encoding be needed? `encodeURIComponent`? 
  // Often data.go.kr keys are already encoded strings or need to be passed as is if using specific clients.
  // Let's try constructing the URL string manually to ensure key is exactly as provided.
  
  const url = `http://apis.data.go.kr/B490001/SJBoheomYoyang/OPA020MT_04_INFO?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&dataType=XML`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    
    return NextResponse.json({
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      body: text
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
