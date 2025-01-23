'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';

import Calculator from './/Calculator';
import InstructionsDialog from './/InstructionDialog';
import ResultTable from './/ResultTable';

export default function ExchangeCalculator({
    initialRates,
    referenceDate,
}: {
    initialRates: ExchangeRate[];
    referenceDate: string;
}) {
    const [exchangeRates] = useState<ExchangeRate[]>(initialRates);

    const euroRate = exchangeRates.find((rate) => rate.cur_unit === 'EUR');
    const dollarRate = exchangeRates.find((rate) => rate.cur_unit === 'USD');

    return (
        <div className="h-[calc(100vh-theme(spacing.32))] flex gap-4">
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
                </CardContent>
            </Card>

            <Card className="flex-grow">
                <CardHeader>
                    <CardTitle className="text-2xl">계산 내역</CardTitle>
                    <CardDescription className="mt-1.5">
                        국내 도착가 계산 내역을 검토해보세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-theme(spacing.24))] overflow-auto">
                    <ResultTable />
                </CardContent>
            </Card>
        </div>
    );
}
