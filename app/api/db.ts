import { MongoClient, ServerApiVersion, AuthMechanism } from "mongodb";

import dotenv from "dotenv";

dotenv.config();
const client = new MongoClient(process.env.MONGO_URL!, {
  serverApi: ServerApiVersion.v1,
  auth: {
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD!,
  },
  authMechanism: AuthMechanism.MONGODB_DEFAULT,
});

const db  = () => client.db(process.env.MONGO_DB!)

export const collection = (name: string) => db().collection(name);

export default db;
