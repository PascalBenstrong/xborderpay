import { Client, Hbar } from "@hashgraph/sdk";

const client = Client.forTestnet();

export const operatorAccountId = process.env.HEDERA_ACCOUNT_ID!;
client.setOperator(operatorAccountId, process.env.HEDERA_PRIVATE_KEY!);
client.setDefaultMaxTransactionFee(new Hbar(100));
client.setMaxQueryPayment(new Hbar(50));

export default client;
