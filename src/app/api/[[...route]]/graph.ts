// latests.ts
import { db } from "@/db";
import {
  attendances,
  classes,
  classSessions,
  studentsToClasses,
  users,
} from "@/db/schema";
import { sql } from "drizzle-orm";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { Hono } from "hono";
import { string } from "zod";

type RawDataType = {
  month: number;
  count: number;
}[];

const app = new Hono()
  .get("/users", async (ctx) => {
    const year = parseInt(
      ctx.req.query("year") ?? String(new Date().getFullYear()),
      10
    );

    const statement = sql`SELECT LPAD(MONTH(createdAt), 2, '0') AS month, COUNT(*) AS count FROM ${users} WHERE YEAR(createdAt) = ${year} GROUP BY month ORDER BY month ASC`;

    const [rawData]: RawDataType[] = (await db.execute(statement)) as any;

    const formattedData = rawData.map((row) => ({
      month: row.month,
      count: row.count,
    }));

    return ctx.json({ data: formattedData });
  })
  .get("/classes", async (ctx) => {
    const year = parseInt(
      ctx.req.query("year") ?? String(new Date().getFullYear()),
      10
    );

    const statement = sql`SELECT LPAD(MONTH(createdAt), 2, '0') AS month, COUNT(*) AS count FROM ${classes} WHERE YEAR(createdAt) = ${year} GROUP BY month ORDER BY month ASC`;

    const [rawData]: RawDataType[] = (await db.execute(statement)) as any;

    const formattedData = rawData.map((row) => ({
      month: row.month,
      count: row.count,
    }));

    return ctx.json({ data: formattedData });
  });

export default app;
