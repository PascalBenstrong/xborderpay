import { User, Option } from "@/types";
import zod from "zod";

function transformValidation<T>(
  schema: zod.ZodType<T>
): (value: T, message?: string) => Option<T> {
  return (value: T, message?: string): Option<T> => {
    const result = schema.safeParse(value);

    if (!result.success) return Option.fromError(message || result.error);

    return Option.fromValue(result.data);
  };
}

const emailString = zod.string().email();

export const validateEmail = transformValidation(emailString);

const nameString = zod
  .string()
  .nonempty({ message: "first name or surname must have value" });

export const validateName = transformValidation(nameString);

export const userValidation = (user: User): Option<boolean> => {
  const email = emailString.safeParse(user.email);

  if (!email.success) {
    return Option.fromError(email.error);
  }
  const firstName = nameString.safeParse(user.firstName);

  if (!firstName.success) {
    return Option.fromError(firstName.error);
  }
  const lastName = nameString.safeParse(user.lastName);
  if (!lastName.success) {
    return Option.fromError(lastName.error);
  }

  return Option.fromValue(true);
};

const passwordString = zod
  .string()
  .min(10, { message: "password must atleast have 10 characters!" });

export const validatePassword = transformValidation(passwordString);
