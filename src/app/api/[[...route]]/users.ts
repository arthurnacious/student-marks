// users.ts
import { db } from "@/db";
import {
  academyHeadsToAcademies,
  insertUserSchema,
  lecturersToAcademies,
  users,
} from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { RoleName } from "@/types/roles";
import { zValidator } from "@hono/zod-validator";
import { and, eq, gt, inArray, isNotNull, isNull, like, or } from "drizzle-orm";
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
            or(gt(users.activeTill, new Date()), isNull(users.activeTill))
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
      values.name = toTitleCase(values.name);
      try {
        const data = await db.insert(users).values({
          ...values,
          activeTill: values.activeTill ? new Date(values.activeTill) : null,
        });

        return ctx.json({ data });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
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
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
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
    academies.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return ctx.json({ data: academies });
  })
  .get("/search/:keyword", async (ctx) => {
    const keyword = ctx.req.param("keyword");
    const results = await db.query.users.findMany({
      where: and(
        like(users.name, `%${keyword}%`),
        eq(users.role, RoleName.STUDENT),
        or(gt(users.activeTill, new Date()), isNull(users.activeTill))
      ),
      columns: { id: true, name: true },
      orderBy: users.name,
    });

    return ctx.json({ data: results ?? [] });
  });

export default app;
