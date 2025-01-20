'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function Calculator({ currency, rate }: { currency: string; rate: number }) {
    const [cost, setCost] = useState<number | null>(null);
    const [condition, setCondition] = useState<number | null>(null);
    const [duties, setDuties] = useState(true);
    const [category, setCategory] = useState<string | null>(null);
    const [result, setResult] = useState<number | null>(null);

    // 배송비 계수
    const SHIPPING_COST: Record<string, number> = {
        acc: 1.04,
        belt: 1.04,
        rtw: 1.05,
        jacket: 1.06,
        shoes: 1.07,
    };

    const handleCalculate = () => {
        if (cost === null || condition === null || category === null) {
            alert('모든 값을 입력해주세요!');
            return;
        }

        const conditionMultiplier = condition / 100;
        const shippingCost = SHIPPING_COST[category] || 1.07; // 카테고리별 배송비
        const dutiesMultiplier = duties ? (category === 'acc' ? 1.08 : 1.13) : 1; // 통관세

        const calculatedResult =
            cost * (1 + conditionMultiplier) * rate * 1.1 * shippingCost * dutiesMultiplier;

        setResult(calculatedResult);
    };

    return (
        <>
            <h2>
                현재 고시환율은 1{currency} 당 <strong>{rate}</strong>원입니다.
            </h2>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="cost">Cost {`(${currency})`}</Label>
                <Input
                    type="number"
                    id="cost"
                    value={cost ?? ''}
                    onChange={(e) => setCost(parseFloat(e.target.value))}
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="condition">Condition (%)</Label>
                <Input
                    type="number"
                    id="condition"
                    value={condition ?? ''}
                    onChange={(e) => setCondition(parseFloat(e.target.value))}
                />
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="duties"
                    checked={duties}
                    onCheckedChange={(checked) => setDuties(checked)}
                />
                <Label htmlFor="duties">Custom Duty</Label>
            </div>
            <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="acc">Acc</SelectItem>
                        <SelectItem value="belt">Belt</SelectItem>
                        <SelectItem value="rtw">T-shirts/Pants</SelectItem>
                        <SelectItem value="jacket">Jacket</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button onClick={handleCalculate}>Calculate</Button>
            {result !== null && (
                <div className="mt-4">
                    <h2>국내 도착가</h2>
                    <p>{result.toFixed(2)}원</p>
                </div>
            )}
        </>
    );
}
