import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.EXCHANGERATE_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    // TODO: 주말, 평일 11시 이전, 공휴일은 직전 영업일 고시 환율로 표시
    // const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${apiKey}&searchdate=${today}&data=AP01`;
    const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${apiKey}&data=AP01`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates: ${response.status}`);
        }

        const data = await response.json();

        // 유로(EUR)와 미국 달러(USD)만 필터링
        const filteredData = data.filter((rate: any) => ['EUR', 'USD'].includes(rate.cur_unit));

        const res = NextResponse.json(filteredData);
        res.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600'); // 하루 동안 캐싱, 만료 후 1시간 동안 재검증
        return res;
    } catch (error: any) {
        console.error('Error fetching exchange rates:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
