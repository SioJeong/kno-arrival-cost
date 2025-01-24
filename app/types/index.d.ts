interface ExchangeRate {
    cur_unit: string; // 통화 영문 약자
    cur_nm: string; // 통화 이름
    tts: string; // 송금 보낼때
}

interface ExchangeRateByEuro {
    date: string; // 데이터 기준 날짜
    eur: {
        [currency: string]: number; // 1유로 기준 다른 통화의 환율
        krw: number; // 1유로당 한국 원화 환율
        usd: number; // 1유로당 미국 달러 환율
    };
}

interface CalculateResult {
    checked: boolean; // 체크표시
    id: string; // Date
    sku: string; // 품번
    cost: string; // 코스트 혹은 리테일
    condition: string; // 컨디션
    category: string; // 카테고리
    customDuty: boolean; // 관세 유무
    finalPrice: number; // 최종 국내 도착가
    memo: string; // 메모
}
