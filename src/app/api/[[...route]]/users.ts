// users.ts
import { db } from "@/db";
import {
  academyHeadsToAcademies,
  insertUserSchema,
  lecturersToAcademies,
  users,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, gt, inArray, isNotNull, or } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const createUserShcema = insertUserSchema.extend({
  activeTill: z.any().optional(),
});

const app = new Hono()
  .get("/", async (ctx) => {
    const role = ctx.req.param("role");
    const where =
      role && role !== "undefined"
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
  .get("/role/:role?", async (ctx) => {
    const role = ctx.req.param("role");
    const where =
      role && role !== "undefined"
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
  .post(
    "/",
    zValidator(
      "json",
      createUserShcema.pick({
        name: true,
        email: true,
        activeTill: true,
        role: true,
      })
    ),
    async (ctx) => {
      const values = ctx.req.valid("json");
      try {
        const data = await db.insert(users).values({
          ...values,
          activeTill: values.activeTill ? new Date(values.activeTill) : null,
        });

        return ctx.json({ data });
      } catch (error: any) {}
    }
  )
  .post(
    "/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (ctx) => {
      const { ids: userIds } = ctx.req.valid("json");

      try {
        const data = await db.delete(users).where(inArray(users.id, userIds));

        return ctx.json({ data: userIds });
      } catch (error: any) {}
    }
  )
  .get("/:id", async (ctx) => {
    const userId = ctx.req.param("id");
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return ctx.json({ data: user });
  })
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
