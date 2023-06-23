import { collection } from "@/api/db";

const transactionCol = () => collection("transaction");

export default transactionCol;
