// courses.ts
import { db } from "@/db";
import { Hono } from "hono";

const app = new Hono().get("/", async (ctx) => {
  const data = await db.query.classes.findMany({});

  return ctx.json({ data });
});

export default app;
