import { FormatMoney } from 'format-money-js';
import { Currency } from '../types';

const convertCurrency = async (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeRates: any
): Promise<number> => {
    const convertedAmount = (amount / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];

    const fm = new FormatMoney({
        decimals: 2
    });
    
    let converted: any = fm.from(
        convertedAmount,
        { symbol: '$' },
        true // Parse, return object
    );

    return converted?.fullAmount;
};

export const getRate = (
    fromCurrency: Currency,
    toCurrency: Currency,
    exchangeRates: any) => {

    const zero = 0;

    if (fromCurrency === toCurrency)
        return zero.toFixed(2)

    let convertedAmount = 0;
    if (fromCurrency != null && toCurrency != null && exchangeRates != null) {
        convertedAmount = (1 / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];
    }

    const fm = new FormatMoney({
        decimals: 2
    });

    let converted: any = fm.from(
        convertedAmount,
        { symbol: '$' },
        true // Parse, return object
    );

    return converted?.fullAmount;

}
export default convertCurrency;
