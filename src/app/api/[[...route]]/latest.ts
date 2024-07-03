// latests.ts
import { db } from "@/db";
import { Hono } from "hono";

const app = new Hono()
  .get("/users", async (ctx) => {
    const limit = parseInt(ctx.req.query("limit") ?? "10", 10);
    const data = await db.query.users.findMany({
      limit,
    });

    return ctx.json({ data });
  })
  .get("/classes", async (ctx) => {
    const limit = parseInt(ctx.req.query("limit") ?? "10", 10);
    const data = await db.query.classes.findMany({
      limit,
    });

    return ctx.json({ data });
  });

export default app;
