import { Currency, Option } from "../../types";
import rates from "./rates.db";
import { validateCurrency } from "../wallets/validations";
import { WithId } from "mongodb";
import { wrapInTryCatch, wrapInTryCatchVoid } from "@/utils/errorHandling";

const ratesUrl = `https://openexchangerates.org/api/latest.json?app_id=${process.env.RATES_API_KEY}&base=USD`;

declare type OpenExchangeRatesResponse = {
  timestamp: number;
  base: string;
  rates: { [currency: string]: number };
};

const newRates = wrapInTryCatchVoid<OpenExchangeRatesResponse>(async () => {
  let data = await fetch(ratesUrl).then((x) => x.json());

  delete data.disclaimer;

  return Option.fromValue(data as OpenExchangeRatesResponse);
});

export const getRates = wrapInTryCatch<OpenExchangeRatesResponse, Currency>(
  async (baseCurrency) => {
    let currencyValidationResult = validateCurrency(baseCurrency);
    if (!currencyValidationResult.isSuccess)
      return Option.fromErrorAndMessage(
        currencyValidationResult.error,
        currencyValidationResult.message!
      );

    const twoHourAgo = Date.now() - 1000 * 60 * 60 * 2;
    const records = await rates
      .find({})
      .sort({ _id: "desc" })
      .limit(1)
      .toArray();

    let record: any;

    const isStaleRecord = () => {
      if (!records || records.length == 0) return true;

      record = records.pop() as WithId<OpenExchangeRatesResponse>;

      return record._id.getTimestamp().getTime() < twoHourAgo;
    };

    const convertToBaseCurrency = (rates: OpenExchangeRatesResponse) => {
      const newRates = Object.assign({}, rates);
      newRates.base = baseCurrency;
      const baseValue = rates.rates[baseCurrency];
      Object.keys(rates.rates).forEach(
        (x) => (newRates.rates[x] = newRates.rates[x] / baseValue)
      );

      return Object.freeze(newRates) as OpenExchangeRatesResponse;
    };

    if (isStaleRecord()) {
      let ratesResult = await newRates();

      if (!ratesResult.isSuccess)
        return Option.fromError(
          new Error("Error getting echange rates! Try again later.")
        );

      await rates.insertOne(ratesResult.value!);

      record = ratesResult.value;
    }

    delete record._id;
    return Option.fromValue(
      convertToBaseCurrency(record as OpenExchangeRatesResponse)
    );
  }
);
