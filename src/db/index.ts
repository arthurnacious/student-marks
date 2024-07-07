import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { dbCredentials } from "./credentials";

const poolConnection = mysql.createPool(dbCredentials);

export const db = drizzle(poolConnection, {
  logger: true,
  mode: "default",
  schema: { ...schema },
});

// const connection = await mysql.createConnection(dbCredentials);

// export const db = drizzle(connection, {
//   mode: "default",
//   schema: { ...schema },
// });
