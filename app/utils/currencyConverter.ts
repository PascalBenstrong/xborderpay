import { FormatMoney } from 'format-money-js';

const convertCurrency = async (
    amount: number,
    fromCurrency: string,
    toCurrency: string
): Promise<number> => {
    // Fetch the latest exchange rates
    var requestOptions: any = {
        method: 'GET',
        redirect: 'follow'
    };

    const response: any = await fetch(`https://openexchangerates.org/api/latest.json?app_id=9a2e487fc0f04386b607eda70dd703cc&base=USD`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));

    console.log(response);

    const exchangeRates = response.rates;

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

    return 0;
};

export default convertCurrency;
