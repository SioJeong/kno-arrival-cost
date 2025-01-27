'use server';

export async function fetchExchangeRates() {
    try {
        const response = await fetch(
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
            {
                next: { revalidate: 3600 }, // 1시간마다 갱신
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = (await response.json()) as ExchangeRateByEuro;

        const krwRate = data.eur.krw; // 1유로당 KRW
        const usdRate = data.eur.usd; // 1유로당 USD

        if (!krwRate || !usdRate) {
            throw new Error('Missing KRW or USD rate in the response');
        }

        // 1% 송금 스프레드 가산
        const krwWithSpread = krwRate * 1.01;

        // Calculate 1달러당 KRW
        const usdToKrwRate = krwWithSpread / usdRate;

        return {
            date: data.date,
            rates: {
                eurToKrw: parseFloat(krwWithSpread.toFixed(2)), // 1유로당 한화 금액 (송금 수수료 포함)
                usdToKrw: parseFloat(usdToKrwRate.toFixed(2)), // 1달러당 한화 금액
            },
        };
    } catch (error) {
        console.error('Exchange rate fetch error:', error);
        return {
            date: '',
            rates: {
                eurToKrw: null,
                usdToKrw: null,
            },
        };
    }
}
