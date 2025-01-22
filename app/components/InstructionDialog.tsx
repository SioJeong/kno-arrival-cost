'use client';

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Shirt, Euro, DollarSign, Package, Percent, Plane, Check } from 'lucide-react';

const InstructionStep = ({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: React.ReactNode;
}) => (
    <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 mt-1">
            <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
            <h3 className="font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

export default function InstructionsDialog() {
    return (
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle className="text-2xl mb-6">국내 도착가 계산기 사용법</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
                <InstructionStep
                    icon={Euro}
                    title="1. 통화 선택"
                    description={
                        <>
                            라인시트에 맞는 기준 통화(<b>유로</b> 혹은 <b>달러</b>)를 선택하세요.
                            <br />
                            환율은 자동으로 <b>가장 가까운 영업일</b>의 최초고시 환율이 적용됩니다.
                        </>
                    }
                />

                <InstructionStep
                    icon={Shirt}
                    title="2. SKU 입력"
                    description={
                        <>
                            계산하려는 상품의 <b>SKU(모델 넘버)</b>를 입력하세요.
                        </>
                    }
                />

                <InstructionStep
                    icon={Check}
                    title="3. 컨디션 설정"
                    description={
                        <>
                            상품에 적용된 <b>컨디션 타입</b>을 선택하세요.
                        </>
                    }
                />

                <InstructionStep
                    icon={DollarSign}
                    title="4. 가격 입력"
                    description={
                        <>
                            <b>Cost(Wholesale) Price</b> 혹은 <b>Retail Price</b>와 Condition을
                            입력하세요.
                            <br />
                            C+, C-, R- 조건에 맞게 기입해 주세요.
                        </>
                    }
                />

                <InstructionStep
                    icon={Package}
                    title="5. 카테고리 선택"
                    description={
                        <>
                            상품의 <b>카테고리</b>를 선택하시면 해당하는 배송요율이 자동으로
                            적용됩니다.
                        </>
                    }
                />

                <Card className="p-4 bg-amber-200">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <Plane className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <h3 className="font-medium mb-1">6. 관세 정보</h3>
                                <p className="text-sm">
                                    • FTA 적용 가능한 <b>EU Origin</b> 제품은 관세 혜택이
                                    가능합니다.
                                    <br />• 대부분의 명품은 <b>EU Origin</b>이므로 관세 없이 계산
                                    가능합니다.
                                    <br />• FTA 불가능 제품은 부피에 따라 관/부가세와 배송비 포함
                                    계수
                                    <b>1.25-1.4</b>가 추가로 적용되어 계산됩니다.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Percent className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <h3 className="font-medium mb-1">7. 부가세</h3>
                                <p className="text-sm">
                                    부가세는 자동으로 <b>10%</b> 적용됩니다.
                                    <br />(<b>K&O int.</b>가 부가세 납부 후 통관 진행)
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DialogContent>
    );
}
