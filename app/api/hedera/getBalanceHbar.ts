import client from "./client";
import { AccountBalanceQuery, Hbar } from "@hashgraph/sdk";
import { Option } from "@/types";

import { wrapInTryCatch } from "@/utils/errorHandling";

const getBalanceHbar = wrapInTryCatch<Hbar, string>(async (accountId) => {
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);

  return Option.fromValue(accountBalance.hbars);
});

export default getBalanceHbar;
