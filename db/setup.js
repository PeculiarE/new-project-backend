import pgPromise from "pg-promise";
import promise from "bluebird";
import dotenv from "dotenv";

dotenv.config({
    debug:true
});

const pgp = pgPromise({ promiseLib: promise, noLocking: true });
const dbUrl = process.env.NODE_ENV === 'test' ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL;
const db = pgp(dbUrl);

export default db;
