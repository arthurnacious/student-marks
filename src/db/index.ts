import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export const dbCredentials = {
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASS as string,
  pool: process.env.DB_PORT as string,
};

const poolConnection = mysql.createPool(dbCredentials);

const db = drizzle(poolConnection);
