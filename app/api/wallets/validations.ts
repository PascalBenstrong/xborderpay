import { transformValidation } from "@/utils/errorHandling";
import { Currency } from "@/types";
import zod from "zod";

const currencySchema = zod.nativeEnum(Currency);
const nameSchema = zod.string().min(1);

//export type CurrencyEnum = zod.infer<typeof currencySchema>;

export const currencyValues = Object.values(Currency).join(", ");

export const validateCurrency = transformValidation(currencySchema);
export const validateName = transformValidation(nameSchema);
export const validate = ({ name, currency }: { name: any; currency: any }) => {
  let validationResult = validateName(name, "name is required!");

  if (!validationResult.isSuccess) return validationResult;

  return validateCurrency(
    currency,
    `invalid currency ${currency}! valid values are ${currencyValues}`
  );
};
