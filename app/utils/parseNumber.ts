import zod from "zod";
const numbersSchema = zod.number();
export  function parseNumber(value: string) {
    const result = numbersSchema.safeParse(parseFloat(value));

  return result.success ? result.data : 0;
}
