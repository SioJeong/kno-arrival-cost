'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Calculator from '../components/Calculator';

export default function ExchangeCalculator() {
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
    const [error, setError] = useState<string | null>(null);

    // API 호출로 환율 데이터 가져오기
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('/api/exchange-rate'); // API Route 호출

                if (!response.ok) {
                    throw new Error('Failed to fetch exchange rates');
                }

                const data = await response.json();
                setExchangeRates(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchRates();
    }, []);

    // 유로와 달러 환율 필터링
    const euroRate = exchangeRates.find((rate) => rate.cur_unit === 'EUR');
    const dollarRate = exchangeRates.find((rate) => rate.cur_unit === 'USD');

    return (
        <>
            <h1>국내 도착가 계산기</h1>
            <Tabs defaultValue="euro" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="euro">유로 €</TabsTrigger>
                    <TabsTrigger value="dollar">달러 $</TabsTrigger>
                </TabsList>
                <TabsContent value="euro">
                    {euroRate ? (
                        <Calculator currency="€" rate={parseFloat(euroRate.tts.replace(',', ''))} />
                    ) : (
                        <p>유로 환율 정보를 불러오는 중...</p>
                    )}
                </TabsContent>
                <TabsContent value="dollar">
                    {dollarRate ? (
                        <Calculator
                            currency="$"
                            rate={parseFloat(dollarRate.tts.replace(',', ''))}
                        />
                    ) : (
                        <p>달러 환율 정보를 불러오는 중...</p>
                    )}
                </TabsContent>
            </Tabs>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </>
    );
}
