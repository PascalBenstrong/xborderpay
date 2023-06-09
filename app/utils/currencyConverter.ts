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

    /* console.log(fm.from(
        convertedAmount,
        { symbol: '$' },
        true // Parse, return object
    )
    ); */

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
    if (fromCurrency === toCurrency || exchangeRates === null)
        return zero.toFixed(2)

    const convertedAmount = (1 / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];



    const fm = new FormatMoney({
        decimals: 2
    });

    console.log("fromCurrency: ", exchangeRates[fromCurrency]);
    console.log("toCurrency: ", exchangeRates[toCurrency]);
    console.log("rate: ", convertedAmount);

    let converted: any = fm.from(
        convertedAmount,
        { symbol: '$' },
        true // Parse, return object
    );

    return converted?.fullAmount;

}
export default convertCurrency;
