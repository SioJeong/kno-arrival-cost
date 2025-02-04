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
import { Star, SquarePen, Trash2, CircleHelp } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ResultTable() {
    const results = useStore(useCalculatorResultStore, (state) => state.results);
    const deleteResult = useStore(useCalculatorResultStore, (state) => state.deleteResult);
    const toggleChecked = useStore(useCalculatorResultStore, (state) => state.toggleChecked);
    const updateMemo = useStore(useCalculatorResultStore, (state) => state.updateMemo);

    // 각 행의 메모 편집 상태를 관리하는 객체: key는 result.id, value는 편집 중인 memo 문자열
    const [editingMemo, setEditingMemo] = useState<{ [id: string]: string }>({});

    const handleMemoSave = (result: CalculateResult) => {
        const newMemo = editingMemo[result.id] ?? '';
        updateMemo(result.id, newMemo);
        toast.success('메모가 저장되었습니다!');
    };

    return (
        <Table>
            <TableCaption>
                목록 좌측의 체크 기능을 활용하여, 바잉하실 상품을 손쉽게 분류하세요! <br />
                <br />
                시장가 검색 기능을 통해 가격을 확인하고 메모도 작성할 수 있습니다.
            </TableCaption>
            <TableHeader className="sticky top-0 bg-white z-10 bg-transparent">
                <TableRow>
                    <TableHead className="w-12 text-center">Check</TableHead>
                    <TableHead className="w-44 text-center">SKU</TableHead>
                    <TableHead className="w-24 text-center">Cost</TableHead>
                    <TableHead className="w-24 text-center">Condition</TableHead>
                    <TableHead className="w-32 text-center">Category</TableHead>
                    <TableHead className="w-20 text-center">Customs</TableHead>
                    <TableHead className="w-32 text-center font-semibold text-emerald-300">
                        Final Price
                    </TableHead>
                    <TableHead className="w-16 text-center">Memo</TableHead>
                    <TableHead className="w-40 text-center">
                        <HoverCard openDelay={0} closeDelay={100}>
                            <HoverCardTrigger asChild>
                                <div className="flex flex-row justify-center items-center gap-2">
                                    시장가 검색
                                    <CircleHelp size={16} className="stroke-card-foreground" />
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-100">
                                <div className="flex flex-col items-start space-y-2 text-sm text-left">
                                    <p>
                                        입력하신 <strong>SKU 넘버</strong>를 다른 플랫폼에서 가격
                                        조회할 수 있도록 만든 시스템입니다.
                                    </p>
                                    <p>
                                        검색 결과가{' '}
                                        <strong>SKU 넘버와 일치하지 않을 수도 있습니다</strong>.
                                    </p>
                                    <p>이 점 유의하시어 검색 부탁드립니다.</p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                    <TableHead className="w-16 text-right">{/* Delete */}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="overflow-auto">
                {results.map((result: CalculateResult) => (
                    <TableRow key={result.id}>
                        <TableCell className="text-center p-0">
                            <div className="flex items-center justify-center h-full w-full">
                                <Star
                                    onClick={() => toggleChecked(result.id)}
                                    size={20}
                                    className={`cursor-pointer transition-colors duration-200 ${
                                        result.checked
                                            ? 'fill-amber-600 text-amber-600'
                                            : 'text-card-foreground'
                                    }`}
                                />
                            </div>
                        </TableCell>
                        <TableCell className="font-semibold text-center">{result.sku}</TableCell>
                        <TableCell className="text-center">{result.cost}</TableCell>
                        <TableCell className="text-center">{result.condition}</TableCell>
                        <TableCell className="text-center">{result.category}</TableCell>
                        <TableCell className="text-center">
                            {result.customDuty ? 'O' : 'X'}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-emerald-300">
                            ₩{result.finalPrice.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={
                                            result.memo?.length
                                                ? 'bg-amber-600 hover:bg-amber-500 border-none'
                                                : 'btn-primary'
                                        }
                                    >
                                        <SquarePen />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`memo-${result.id}`}>Memo</Label>
                                            <Textarea
                                                id={`memo-${result.id}`}
                                                placeholder="메모를 입력하세요."
                                                value={
                                                    editingMemo[result.id] !== undefined
                                                        ? editingMemo[result.id]
                                                        : result.memo || ''
                                                }
                                                onChange={(e) =>
                                                    setEditingMemo((prev) => ({
                                                        ...prev,
                                                        [result.id]: e.target.value,
                                                    }))
                                                }
                                                className="max-h-40"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => handleMemoSave(result)}
                                            className="w-full btn-primary"
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
                                className="bg-red-900 hover:bg-red-800"
                                size="sm"
                                onClick={() => {
                                    deleteResult(result.id);
                                    toast.success('계산 내역이 삭제되었습니다!');
                                }}
                            >
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
