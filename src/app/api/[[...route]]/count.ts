// count.ts
import { db } from "@/db";
import { departments, classes, courses, users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
  .get("/departments", async (ctx) => {
    const [data] = await db
      .select({
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(departments);

    return ctx.json({ data });
  })
  .get("/users", async (ctx) => {
    const [data] = await db
      .select({
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(users);

    return ctx.json({ data });
  })
  .get("/classes", async (ctx) => {
    const [data] = await db
      .select({
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(classes);

    return ctx.json({ data });
  })
  .get("/courses", async (ctx) => {
    const [data] = await db
      .select({
        count: sql`COUNT(*)`.as("count"),
      })
      .from(courses);

    return ctx.json({ data });
  });

export default app;
