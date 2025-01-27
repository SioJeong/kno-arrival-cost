import { fetchExchangeRates } from './actions/fetchExchangeRates';
import ArrivalCostCalculator from './components/ArrivalCostCalculator';

export default async function Page() {
    const { date, rates } = await fetchExchangeRates();

    return <ArrivalCostCalculator initialRates={rates} referenceDate={date} />;
}
