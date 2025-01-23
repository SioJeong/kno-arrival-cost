'use client';

import { useEffect, useState } from 'react';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import Calculator from './components/Calculator';
import InstructionsDialog from './components/InstructionDialog';
import ResultTable from './components/ResultTable';

export default function ExchangeCalculator() {
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [referenceDate, setReferenceDate] = useState<string>('');

    // TODO: 한국 공휴일 적용 로직 필요!!
    // 유효한 환율 조회 날짜 계산 (한국 시간 기준)
    const calculateValidDate = () => {
        // 현재 시간을 KST로 변환
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const kstOffset = 9 * 60 * 60000;
        const kstTime = new Date(utc + kstOffset);

        const currentHour = kstTime.getHours();
        const dayOfWeek = kstTime.getDay(); // 0: 일요일, 6: 토요일

        // 기준일자 설정 (평일 11시 이전이거나 주말인 경우 이전 날짜를 사용)
        const targetDate = new Date(kstTime);

        let reason = '';
        // 주말인 경우
        if (dayOfWeek === 0) {
            // 일요일
            targetDate.setDate(targetDate.getDate() - 2); // 금요일로
            reason = '주말';
        } else if (dayOfWeek === 6) {
            // 토요일
            targetDate.setDate(targetDate.getDate() - 1); // 금요일로
            reason = '주말';
        } else if (currentHour < 11) {
            // 평일 11시 이전
            targetDate.setDate(targetDate.getDate() - 1);
            reason = '11시 이전';

            // 만약 전날이 일요일이면 금요일로, 토요일이면 금요일로
            const prevDayOfWeek = targetDate.getDay();
            if (prevDayOfWeek === 0) {
                // 일요일
                targetDate.setDate(targetDate.getDate() - 2);
            } else if (prevDayOfWeek === 6) {
                // 토요일
                targetDate.setDate(targetDate.getDate() - 1);
            }
        }

        // YYYYMMDD 형식으로 변환
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');

        // 화면에 표시할 날짜 문자열 생성
        const displayDate = `${year}년 ${month}월 ${day}일${reason ? ` (${reason})` : ''}`;
        setReferenceDate(displayDate);

        return `${year}${month}${day}`;
    };

    // API 호출로 환율 데이터 가져오기
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const searchDate = calculateValidDate();
                const response = await fetch(`/api/exchange-rate?searchdate=${searchDate}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch exchange rates');
                }

                const data = await response.json();
                setExchangeRates(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            }
        };

        fetchRates();
    }, []);

    // 유로와 달러 환율 필터링
    const euroRate = exchangeRates.find((rate) => rate.cur_unit === 'EUR');
    const dollarRate = exchangeRates.find((rate) => rate.cur_unit === 'USD');

    return (
        <div className="h-[calc(100vh-theme(spacing.32))] flex gap-4">
            {/* 왼쪽 카드 */}
            <Card className="w-104 p-4 py-2 flex-shrink-0">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">국내 도착가 계산기</CardTitle>
                            <CardDescription className="mt-1.5">
                                간단한 입력으로 최종 가격을 산정하세요.
                            </CardDescription>
                        </div>
                        <HoverCard openDelay={0} closeDelay={0}>
                            <HoverCardTrigger asChild>
                                <Button variant="outline" size="sm">
                                    사용법
                                </Button>
                            </HoverCardTrigger>
                            <InstructionsDialog />
                        </HoverCard>
                    </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-theme(spacing.24))] overflow-auto">
                    <Tabs defaultValue="euro" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="euro">유로 €</TabsTrigger>
                            <TabsTrigger value="dollar">달러 $</TabsTrigger>
                        </TabsList>
                        <p className="text-xs text-right text-slate-600 mb-4">
                            기준 일자: {referenceDate}
                        </p>
                        <TabsContent value="euro">
                            {euroRate ? (
                                <Calculator
                                    currency="€"
                                    rate={parseFloat(euroRate.tts.replace(',', ''))}
                                />
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
                </CardContent>
            </Card>

            {/* 오른쪽 카드 */}
            <Card className="flex-grow">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">계산 내역</CardTitle>
                            <CardDescription className="mt-1.5">
                                국내 도착가 계산 내역을 검토해보세요.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-theme(spacing.24))] overflow-auto">
                    <ResultTable />
                </CardContent>
            </Card>
        </div>
    );
}
