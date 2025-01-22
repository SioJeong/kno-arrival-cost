interface ExchangeRate {
    cur_unit: string; // 통화 영문 약자
    cur_nm: string; // 통화 이름
    tts: string; // 송금 보낼때
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
