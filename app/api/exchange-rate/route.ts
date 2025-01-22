import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const API_KEY = process.env.EXCHANGERATE_API_KEY;
    const { searchParams } = new URL(request.url);
    const searchdate = searchParams.get('searchdate');

    if (!API_KEY) {
        return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    if (!searchdate) {
        return NextResponse.json({ error: 'Search date is required' }, { status: 400 });
    }

    const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${API_KEY}&searchdate=${searchdate}&data=AP01`;

    console.log(url);

    try {
        const response = await fetch(url);
        console.log(response.status);

        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates: ${response.status}`);
        }

        const data = await response.json();

        const filteredData = data.filter((rate: any) => ['EUR', 'USD'].includes(rate.cur_unit));

        const res = NextResponse.json(filteredData);
        res.headers.set('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');

        return res;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
