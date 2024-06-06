// users.ts
import { db } from "@/db";
import { academies, users } from "@/db/schema";
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
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`))
  .get("/:id/academies", async (ctx) => {
    const userId = ctx.req.param("id");
    const userWithAcademies = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        academiesLeading: {
          with: {
            academy: {
              columns: { name: true, id: true },
            },
          },
        },
      },
    });

    if (!userWithAcademies) {
      return ctx.json({ error: "User not found" }, 404);
    }

    const academies = userWithAcademies.academiesLeading.map(
      ({ academy }) => academy
    );

    return ctx.json({ data: academies });
  });

export default app;
