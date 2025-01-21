'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { toast } from 'sonner';
import { Calculator } from 'lucide-react';

export default function CalculatorApp({ currency, rate }: { currency: string; rate: number }) {
    const [sku, setSku] = useState<string | null>(null);
    const [conditionType, setConditionType] = useState('cost'); // 'cost' or 'retail'
    const [cost, setCost] = useState<number | null>(null);
    const [condition, setCondition] = useState<number | null>(null);
    const [duties, setDuties] = useState(false);
    const [category, setCategory] = useState<string | null>(null);
    const [result, setResult] = useState<number | null>(null);

    const isReady = sku !== null && cost !== null && condition !== null && category !== null;

    const SHIPPING_COST: Record<string, number> = {
        acc: 1.04,
        belt: 1.04,
        rtw: 1.05,
        jacket: 1.06,
        shoes: 1.07,
    };

    const handleCalculate = () => {
        if (!isReady) return;

        let calculatedResult;
        const shippingCost = SHIPPING_COST[category] || 1.07;
        const dutiesMultiplier = duties ? (category === 'acc' ? 1.08 : 1.13) : 1;

        if (conditionType === 'cost') {
            // Cost + Condition calculation
            const conditionMultiplier = condition / 100;
            calculatedResult =
                cost * (1 + conditionMultiplier) * rate * 1.1 * shippingCost * dutiesMultiplier;
        } else {
            // Retail - Condition calculation
            const conditionDeduction = condition / 100;
            calculatedResult =
                cost * (1 - conditionDeduction) * rate * 1.1 * shippingCost * dutiesMultiplier;
        }

        const roundedResult = Math.round(calculatedResult / 100) * 100;

        setResult(roundedResult);
    };

    return (
        <div className="w-full mx-auto space-y-4">
            {/* 환율 정보 */}
            <div className="text-right rounded-lg">
                <h2 className="text-xs text-slate-600">
                    현재 적용된 환율은 기준일자의 최초고시환율{' '}
                    <strong className="text-slate-900">1{currency}</strong> 당{' '}
                    <strong className="text-slate-900">{rate}</strong>원입니다.
                </h2>
            </div>

            <div className="space-y-4">
                {/* 아이템 SKU 입력 필드*/}
                <div>
                    <Label htmlFor="sku">Item SKU</Label>
                    <Input
                        type="text"
                        id="sku"
                        value={sku ?? ''}
                        onChange={(e) => setSku(e.target.value)}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                {/* 컨디션 타입 설정 */}
                <div className="space-y-1.5">
                    <Label>Condition Type</Label>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <RadioGroup
                                value={conditionType}
                                onValueChange={setConditionType}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cost" id="cost-condition" />
                                    <Label htmlFor="cost-condition">Cost Price ±</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="retail" id="retail-condition" />
                                    <Label htmlFor="retail-condition">Retail Price -</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                    컨디션 타입이란?
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-140">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-lg">컨디션 타입 설명</h4>
                                    <div className="p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm mb-1">
                                            <b>Cost ± Condition</b>: 원가에 컨디션 요율을 적용하여
                                            납품가를 산정합니다.
                                        </p>
                                        <p className="text-sm">
                                            예를들어 Cost Price 100€에 Condition이 20%라면{' '}
                                            <b>120€</b>이 됩니다.
                                        </p>
                                    </div>
                                    <div className="p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm mb-1">
                                            <b>Retail - Condition</b>: 소비자가에 컨디션 요율을
                                            적용하여 납품가를 산정합니다.
                                        </p>
                                        <p className="text-sm">
                                            예를들어 Retail Price 100€에 Condition이 -20%라면{' '}
                                            <b>80€</b>이 됩니다.
                                        </p>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* 입력 필드 그룹 */}
                {/* Cost/Retail과 Condition 입력 (가로 배치) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="cost">
                            {conditionType === 'cost' ? 'Cost Price' : 'Retail Price'}{' '}
                            {`(${currency})`}
                        </Label>
                        <Input
                            type="number"
                            id="cost"
                            value={cost ?? ''}
                            onChange={(e) => setCost(parseFloat(e.target.value))}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="condition">
                            Condition ({conditionType === 'cost' ? '±' : '-'}%)
                        </Label>
                        <Input
                            type="number"
                            id="condition"
                            value={condition ?? ''}
                            onChange={(e) => setCondition(parseFloat(e.target.value))}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                </div>

                {/* 카테고리 선택 */}
                <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select onValueChange={(value) => setCategory(value)}>
                        <SelectTrigger>
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
                </div>

                {/* 관세 설정 */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg space-y-1.5">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="duties"
                            checked={duties}
                            onCheckedChange={(checked) => setDuties(checked)}
                        />
                        <Label htmlFor="duties">관세 유무</Label>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                                관세 유무란?
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-140">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-lg">관세 적용</h4>
                                <div className="p-4 py-2 bg-amber-200 rounded-md">
                                    <p className="text-sm">
                                        FTA 적용 가능한 EU Origin 제품은 관세 혜택이 가능합니다.
                                    </p>
                                </div>
                                <div className="p-4 py-2 bg-amber-200 rounded-md">
                                    <p className="text-sm">
                                        대부분의 명품은 EU Origin이므로 관세 없이 계산 가능합니다.
                                    </p>
                                </div>
                                <div className="p-4 py-2 bg-amber-200 rounded-md">
                                    <p className="text-sm">
                                        FTA 불가능 제품은 부피에 따라 관/부가세와 배송비 포함
                                        <br />
                                        계수 <b>1.25-1.4</b>가 추가로 적용되어 계산됩니다.
                                    </p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div>
                {/* 계산 버튼 */}
                <Button
                    className="w-full"
                    onClick={() => {
                        handleCalculate();
                        toast('저장되었습니다! 아래에서 확인하세요.');
                    }}
                    disabled={!isReady}
                >
                    <Calculator /> Calculate
                </Button>

                {/* 결과 표시 */}
                <div className="mt-6 bg-slate-50 p-4 rounded-lg">
                    <h2 className="text-sm text-slate-600 mb-2">국내 도착가</h2>
                    <p className="text-2xl text-right font-bold text-slate-900">
                        {result
                            ? result.toLocaleString('ko-KR', { maximumFractionDigits: 0 })
                            : '- '}
                        원
                    </p>
                </div>
            </div>
        </div>
    );
}
