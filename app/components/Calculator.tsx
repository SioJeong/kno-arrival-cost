'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
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
import { Calculator, MessageCircleQuestion } from 'lucide-react';
import { useStore } from 'zustand';
import useCalculatorResultStore from '../store/calculatorResultStore';

export default function CalculatorApp({ currency, rate }: { currency: string; rate: number }) {
    const [sku, setSku] = useState<string | null>(null);
    const [conditionType, setConditionType] = useState('costPlus'); // 'costPlus' or 'retailMinus' or 'costMinus' or 'retailPlus'
    const [cost, setCost] = useState<number | null>(null);
    const [condition, setCondition] = useState<number | null>(null);
    const [duties, setDuties] = useState<string>('dutyFree'); // 'dutyFree' or 'notDutyFree'
    const [category, setCategory] = useState<string | null>(null);
    const [result, setResult] = useState<number | null>(null);

    const addResult = useStore(useCalculatorResultStore, (state) => state.addResult);

    const isReady = sku !== null && cost !== null && condition !== null && category !== null;

    const SHIPPING_COST: Record<string, number> = {
        acc: 1.04,
        belt: 1.04,
        rtw: 1.05,
        largeAcc: 1.05,
        jacket: 1.06,
        shoes: 1.07,
    };

    const handleCalculate = () => {
        if (!isReady) return;

        let calculatedResult = 0;
        const shippingCost = SHIPPING_COST[category!] || 1.07;
        const dutiesMultiplier =
            duties === 'notDutyFree'
                ? category === 'acc' || category === 'largeAcc'
                    ? 1.08
                    : 1.13
                : 1;
        const conditionMultiplier = (condition ?? 0) / 100;

        switch (conditionType) {
            case 'costPlus':
                calculatedResult =
                    (cost ?? 0) *
                    (1 + conditionMultiplier) *
                    rate *
                    1.1 *
                    shippingCost *
                    dutiesMultiplier;
                break;
            case 'retailMinus':
                calculatedResult =
                    (cost ?? 0) *
                    (1 - conditionMultiplier) *
                    rate *
                    1.1 *
                    shippingCost *
                    dutiesMultiplier;
                break;
            case 'costMinus':
                calculatedResult =
                    (cost ?? 0) *
                    (1 - conditionMultiplier) *
                    rate *
                    1.1 *
                    shippingCost *
                    dutiesMultiplier;
                break;
            case 'retailPlus':
                calculatedResult =
                    (cost ?? 0) *
                    (1 + conditionMultiplier) *
                    rate *
                    1.1 *
                    shippingCost *
                    dutiesMultiplier;
                break;
        }

        const roundedResult = Math.round(calculatedResult / 100) * 100;
        setResult(roundedResult);

        const conditionTypeMapper: Record<string, string> = {
            costPlus: 'C+',
            costMinus: 'C-',
            RetailPlus: 'R+',
            RetailMinus: 'R-',
        };

        const categoryMapper: Record<string, string> = {
            acc: 'Acc',
            belt: 'Belt',
            rtw: 'T-shirts/Pants',
            largeAcc: 'Bag/LLG',
            jacket: 'Jacket',
            shoes: 'Shoes',
        };

        // Zustand 스토어에 결과 저장
        const newResult = {
            checked: false,
            id: `${Date.now()}`,
            sku: sku as string,
            cost: `${currency} ${(cost ?? 0).toFixed(2)}`,
            condition: `${conditionTypeMapper[conditionType]}${condition ?? 0}%`,
            category: `${categoryMapper[category ?? '']}`,
            customDuty: duties === 'notDutyFree',
            finalPrice: roundedResult,
            memo: '',
        };

        addResult(newResult);
    };

    return (
        <div
            className={`
        h-full 
        flex 
        flex-col 
        justify-between 
        space-y-2
      `}
        >
            {/* 환율 정보 */}
            <div className="text-right rounded-lg">
                <div className="flex items-center justify-end gap-1">
                    {/* 폰트 사이즈 반응형 */}
                    <h2 className="text-xs text-slate-600">
                        현재 적용된 환율은 기준일자의 최초고시환율{' '}
                        <strong className="text-slate-900">1{currency}</strong> 당{' '}
                        <strong className="text-slate-900">{rate}</strong>원입니다.
                    </h2>
                    <HoverCard openDelay={0} closeDelay={0}>
                        <HoverCardTrigger asChild>
                            <MessageCircleQuestion size={16} className="stroke-slate-600" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-140">
                            <div className="space-y-2">
                                <div className="p-2 md:p-4 py-2 rounded-md">
                                    <p className="text-sm mb-1 text-left">
                                        이 환율은 <b>글로벌 시장에서 고시된 기준 환율</b>을 바탕으로
                                        갱신된 값입니다.
                                    </p>
                                    <p className="text-sm mb-1 text-left">
                                        환율 정보는 <b>실시간으로 변동</b>될 수 있으며, 일부 오차가
                                        있을 수 있습니다.
                                    </p>
                                    <p className="text-sm mb-1 text-left">
                                        금융 거래 시 반드시 <b>최신 환율</b>을 확인하시기 바랍니다.
                                    </p>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>
            </div>

            <div
                className={`
          space-y-2
          md:space-y-4
        `}
            >
                {/* 아이템 SKU 입력 필드*/}
                <div>
                    <Label htmlFor="sku" className="text-sm">
                        Item SKU
                    </Label>
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
                    <Label className="text-sm">Condition Type</Label>
                    <div
                        className={`
              flex items-center justify-between 
              bg-slate-50 
              p-2 md:p-3 
              rounded-lg
            `}
                    >
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <RadioGroup
                                value={conditionType}
                                onValueChange={setConditionType}
                                className="grid grid-cols-2 gap-2"
                            >
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <RadioGroupItem value="costPlus" id="cost-plus-condition" />
                                    <Label htmlFor="cost-plus-condition" className="text-sm">
                                        Cost Price +
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <RadioGroupItem
                                        value="retailMinus"
                                        id="retail-minus-condition"
                                    />
                                    <Label htmlFor="retail-minus-condition" className="text-sm">
                                        Retail Price -
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <RadioGroupItem value="costMinus" id="cost-minus-condition" />
                                    <Label htmlFor="cost-minus-condition" className="text-sm">
                                        Cost Price -
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <RadioGroupItem value="retailPlus" id="retail-plus-condition" />
                                    <Label htmlFor="retail-plus-condition" className="text-sm">
                                        Retail Price +
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <HoverCard openDelay={0} closeDelay={0}>
                            <HoverCardTrigger asChild>
                                <Button variant="outline" size="sm" className="text-sm">
                                    컨디션 타입이란?
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-140">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-lg">컨디션 타입 설명</h4>
                                    <div className="p-2 md:p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm mb-1">
                                            <b>Cost Price +</b>: 원가에 컨디션을 더하여 납품가를
                                            산정합니다.
                                        </p>
                                        <p className="text-sm">
                                            예를들어 Cost Price 100€에 Condition이 20%라면{' '}
                                            <b>120€</b>이 됩니다.
                                        </p>
                                    </div>
                                    <div className="p-2 md:p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm mb-1">
                                            <b>Retail Price -</b>: 소비자가에서 컨디션을 빼고
                                            납품가를 산정합니다.
                                        </p>
                                        <p className="text-sm">
                                            예를들어 Retail Price 100€에 Condition이 20%라면{' '}
                                            <b>80€</b>이 됩니다.
                                        </p>
                                    </div>
                                    <div className="p-2 md:p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm mb-1">
                                            <b>Cost Price -</b>: 원가에서 컨디션을 빼고 납품가를
                                            산정합니다.
                                        </p>
                                        <p className="text-sm">
                                            예를들어 Cost Price 100€에 Condition이 20%라면{' '}
                                            <b>80€</b>이 됩니다.
                                        </p>
                                    </div>
                                    <div className="p-2 md:p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm mb-1">
                                            <b>Retail Price +</b>: 소비자가에 컨디션을 더하여
                                            납품가를 산정합니다.
                                        </p>
                                        <p className="text-sm">
                                            예를들어 Retail Price 100€에 Condition이 20%라면{' '}
                                            <b>120€</b>이 됩니다.
                                        </p>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>

                {/* 입력 필드 그룹 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="cost" className="text-sm">
                            {conditionType.startsWith('cost') ? 'Cost Price' : 'Retail Price'}{' '}
                            {`(${currency})`}
                        </Label>
                        <Input
                            type="number"
                            id="cost"
                            value={cost ?? ''}
                            onChange={(e) =>
                                setCost(e.target.value ? parseFloat(e.target.value) : null)
                            }
                            min={0}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="condition" className="text-sm">
                            Condition{' '}
                            {conditionType === 'costPlus' || conditionType === 'retailPlus'
                                ? '(+'
                                : '(-'}
                            %)
                        </Label>
                        <Input
                            type="number"
                            id="condition"
                            value={condition ?? ''}
                            onChange={(e) =>
                                setCondition(e.target.value ? parseFloat(e.target.value) : null)
                            }
                            min={0}
                            max={100}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                </div>

                {/* 카테고리 선택 */}
                <div className="space-y-1.5">
                    <Label className="text-sm">Category</Label>
                    <Select onValueChange={(value) => setCategory(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="카테고리를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category (배송요율)</SelectLabel>
                                <SelectItem value="acc">Acc (4%)</SelectItem>
                                <SelectItem value="belt">Belt (4%)</SelectItem>
                                <SelectItem value="rtw">T-shirts/Pants (5%)</SelectItem>
                                <SelectItem value="largeAcc">Bag/LLG (5%)</SelectItem>
                                <SelectItem value="jacket">Jacket (6%)</SelectItem>
                                <SelectItem value="shoes">Shoes (7%)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 관세 설정 */}
                <div className="space-y-1.5">
                    <Label className="text-sm">Customs Duty</Label>
                    <div className="flex items-center justify-between bg-slate-50 p-2 md:p-3 rounded-lg">
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <RadioGroup
                                value={duties}
                                onValueChange={setDuties}
                                className="flex space-x-2 md:space-x-4"
                            >
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <RadioGroupItem value="dutyFree" id="dutyFree" />
                                    <Label htmlFor="dutyFree" className="text-sm">
                                        관세 없음
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <RadioGroupItem value="notDutyFree" id="notDutyFree" />
                                    <Label htmlFor="notDutyFree" className="text-sm">
                                        관세 있음
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <HoverCard openDelay={0} closeDelay={0}>
                            <HoverCardTrigger asChild>
                                <Button variant="outline" size="sm" className="text-sm">
                                    관세 유무란?
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-140">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-lg">관세 적용</h4>
                                    <div className="p-2 md:p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm">
                                            FTA 적용 가능한 EU Origin 제품은 관세 혜택이 가능합니다.
                                        </p>
                                    </div>
                                    <div className="p-2 md:p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm">
                                            대부분의 명품은 EU Origin이므로 관세 없이 계산
                                            가능합니다.
                                        </p>
                                    </div>
                                    <div className="p-2 md:p-4 py-2 bg-amber-200 rounded-md">
                                        <p className="text-sm">
                                            FTA 불가능 제품은 부피에 따라 관/부가세와 배송비 포함
                                            <br />
                                            계수 <b>1.25-1.4</b>가 추가로 적용되어 계산됩니다.
                                        </p>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            </div>

            {/* 하단 영역 (버튼 + 결과 표시) */}
            <div>
                {/* 계산 버튼 */}
                <Button
                    className="w-full text-base"
                    onClick={() => {
                        handleCalculate();
                        toast.success('저장되었습니다! 계산 내역에서 확인하세요.');
                    }}
                    disabled={!isReady}
                >
                    <Calculator /> Calculate
                </Button>

                {/* 결과 표시 */}
                <div className="mt-3 md:mt-6 bg-slate-50 p-2 md:p-4 rounded-lg">
                    <h2 className="text-xs text-slate-600 mb-2">국내 도착가</h2>
                    <p className="text-lg md:text-xl text-right font-bold text-slate-900">
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
