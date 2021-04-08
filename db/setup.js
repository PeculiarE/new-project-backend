import pgPromise from "pg-promise";
import promise from "bluebird";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise({ promiseLib: promise, noLocking: true });

const dbUrl = process.env.DATABASE_URL;

const db = pgp(dbUrl);

export default db;
