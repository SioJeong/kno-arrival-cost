import { fetchExchangeRates2 } from './actions/fetchExchangeRates2';
import ArrivalCostCalculator from './components/ArrivalCostCalculator';

export default async function Page() {
    const { date, rates } = await fetchExchangeRates2();

    return <ArrivalCostCalculator initialRates={rates} referenceDate={date} />;
}
