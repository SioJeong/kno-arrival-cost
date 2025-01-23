'use client';

import { useStore } from 'zustand';
import useCalculatorResultStore from '../store/calculatorResultStore';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Star, SquarePen, Trash2, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useState } from 'react';

export default function ResultTable() {
    const results = useStore(useCalculatorResultStore, (state) => state.results);
    const deleteResult = useStore(useCalculatorResultStore, (state) => state.deleteResult);
    const toggleChecked = useStore(useCalculatorResultStore, (state) => state.toggleChecked);
    const updateResult = useStore(useCalculatorResultStore, (state) => state.updateResult);

    // 현재 편집 중인 메모 상태 관리
    const [editingMemo, setEditingMemo] = useState<string>('');

    // 메모 수정 핸들러
    const handleMemoSave = (result: CalculateResult) => {
        updateResult({
            ...result,
            memo: editingMemo,
        });
    };

    return (
        <div className="h-full">
            <div className="overflow-auto h-full">
                <Table>
                    <TableCaption>
                        시장가 검색 기능과 목록 좌측의 체크 기능을 활용하여, 바잉하실 상품을 손쉽게
                        분류하세요!{' '}
                    </TableCaption>
                    <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead className="w-12 text-center">Check</TableHead>
                            <TableHead className="w-44 text-center">SKU</TableHead>
                            <TableHead className="w-24 text-center">Cost</TableHead>
                            <TableHead className="w-24 text-center">Condition</TableHead>
                            <TableHead className="w-32 text-center">Category</TableHead>
                            <TableHead className="w-20 text-center">Customs</TableHead>
                            <TableHead className="w-32 text-center font-semibold">
                                Final Price
                            </TableHead>
                            <TableHead className="w-16 text-center">Memo</TableHead>
                            <TableHead className="w-40 text-center">
                                <HoverCard openDelay={0} closeDelay={0}>
                                    <HoverCardTrigger asChild>
                                        <div className="flex flex-row justify-center items-center gap-2">
                                            시장가 검색
                                            <MessageCircleQuestion size={20} color="black" />
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-100">
                                        <div className="flex flex-col items-start space-y-2 text-xs text-left">
                                            <p>
                                                입력하신 <strong>SKU 넘버</strong>를 다른 플랫폼에서
                                                가격 조회할 수 있도록 만든 시스템입니다.
                                            </p>
                                            <p>
                                                검색 결과가{' '}
                                                <strong>
                                                    SKU 넘버와 일치하지 않을 수도 있습니다
                                                </strong>
                                                .
                                            </p>
                                            <p>이 점 유의하시어 검색 부탁드립니다.</p>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </TableHead>
                            <TableHead className="w-16 text-right">{/* Delete */}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((result: CalculateResult) => (
                            <TableRow
                                key={result.id}
                                className={`${result.checked ? 'bg-lime-300' : ''} hover:${
                                    result.checked ? 'bg-lime-100' : 'bg-zinc-100'
                                }`}
                            >
                                <TableCell className="text-center p-0">
                                    <div className="flex items-center justify-center h-full w-full">
                                        <Star
                                            onClick={() => toggleChecked(result.id)}
                                            size={24}
                                            className={`cursor-pointer transition-colors duration-200 ${
                                                result.checked
                                                    ? 'fill-yellow-500 text-yellow-500'
                                                    : 'text-gray-400'
                                            }`}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold">{result.sku}</TableCell>
                                <TableCell className="text-center">{result.cost}</TableCell>
                                <TableCell className="text-center">{result.condition}</TableCell>
                                <TableCell className="text-center">{result.category}</TableCell>
                                <TableCell className="text-center">
                                    {result.customDuty ? 'O' : 'X'}
                                </TableCell>
                                <TableCell className="text-center font-semibold">
                                    ₩{result.finalPrice.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <SquarePen />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="memo">Memo</Label>
                                                    <Textarea
                                                        id="memo"
                                                        placeholder="메모를 입력하세요."
                                                        defaultValue={result.memo}
                                                        onChange={(e) =>
                                                            setEditingMemo(e.target.value)
                                                        }
                                                        className="max-h-40"
                                                    />
                                                </div>
                                                <Button
                                                    onClick={() => handleMemoSave(result)}
                                                    className="w-full"
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                <TableCell className="p-2">
                                    <div className="flex flex-wrap justify-center gap-2 w-full">
                                        <Button size="sm" className="w-full sm:w-14">
                                            <Link
                                                href={`https://kream.co.kr/search?keyword=${result.sku}`}
                                                target="_blank"
                                                className="w-full"
                                            >
                                                Kream
                                            </Link>
                                        </Button>
                                        <Button size="sm" className="w-full sm:w-14">
                                            <Link
                                                href={`https://www.balaan.co.kr/products?keyword=${result.sku}&page=1&sort=lowPrice&lowest=Y`}
                                                target="_blank"
                                                className="w-full"
                                            >
                                                발란
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        className="bg-red-400"
                                        size="sm"
                                        onClick={() => deleteResult(result.id)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
