import { fetchExchangeRates } from './actions/fetchExchangeRates';
import ArrivalCostCalculator from './components/ArrivalCostCalculator';

export default async function Page() {
    const { rates, referenceDate } = await fetchExchangeRates();

    return <ArrivalCostCalculator initialRates={rates} referenceDate={referenceDate} />;
}
