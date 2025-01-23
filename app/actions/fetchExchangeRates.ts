'use server';

import fetch from 'node-fetch';
import { calculateValidDate } from '../utils/calculateValidDate';

export async function fetchExchangeRates() {
    try {
        const searchDate = calculateValidDate();
        const API_KEY = process.env.EXCHANGERATE_API_KEY;

        const response = await fetch(
            `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${API_KEY}&searchdate=${searchDate}&data=AP01`,
            {
                agent: new (require('https').Agent)({ rejectUnauthorized: false }),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = (await response.json()) as ExchangeRate[];

        return {
            rates: data.filter((rate: ExchangeRate) => ['EUR', 'USD'].includes(rate.cur_unit)),
            referenceDate: calculateValidDate(true),
        };
    } catch (error) {
        console.error('Exchange rate fetch error:', error);
        return {
            rates: [],
            referenceDate: '날짜 정보 없음',
        };
    }
}
