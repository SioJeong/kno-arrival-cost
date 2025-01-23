export function calculateValidDate(displayFormat = false) {
    // TODO: 한국 공휴일 적용 로직 필요!!
    // 유효한 환율 조회 날짜 계산 (한국 시간 기준)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const kstOffset = 9 * 60 * 60000;
    const kstTime = new Date(utc + kstOffset);

    const currentHour = kstTime.getHours();
    const dayOfWeek = kstTime.getDay();

    const targetDate = new Date(kstTime);
    let reason = '';

    if (dayOfWeek === 0) {
        targetDate.setDate(targetDate.getDate() - 2);
        reason = '주말';
    } else if (dayOfWeek === 6) {
        targetDate.setDate(targetDate.getDate() - 1);
        reason = '주말';
    } else if (currentHour < 11) {
        targetDate.setDate(targetDate.getDate() - 1);
        reason = '11시 이전';

        const prevDayOfWeek = targetDate.getDay();
        if (prevDayOfWeek === 0) {
            targetDate.setDate(targetDate.getDate() - 2);
        } else if (prevDayOfWeek === 6) {
            targetDate.setDate(targetDate.getDate() - 1);
        }
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');

    if (displayFormat) {
        return `${year}년 ${month}월 ${day}일${reason ? ` (${reason})` : ''}`;
    }

    return `${year}${month}${day}`;
}
