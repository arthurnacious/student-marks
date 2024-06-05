// users.ts
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, gt, isNotNull, ne, or, sql } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
  .get("/:role?", async (ctx) => {
    const role = ctx.req.param("role");
    const where = role
      ? and(
          eq(users.role, role),
          or(gt(users.activeTill, new Date()), isNotNull(users.activeTill))
        )
      : undefined;

    const data = await db.query.users.findMany({
      where,
    });

    return ctx.json({ data });
  })
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app;
