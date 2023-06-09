import { FormatMoney } from 'format-money-js';

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

    console.log("rates: ",exchangeRates);
    console.log("convertedAmount: ",convertedAmount);

    console.log(fm.from(
        convertedAmount,
        { symbol: '$' },
        true // Parse, return object
    )
    );

    let converted:any = fm.from(
        convertedAmount,
        { symbol: '$' },
        true // Parse, return object
    );

    return converted?.fullAmount;
};

export default convertCurrency;
