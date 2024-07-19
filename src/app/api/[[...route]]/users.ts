// users.ts
import { db } from "@/db";
import { insertUserSchema, users } from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { RoleName } from "@/types/roles";
import { zValidator } from "@hono/zod-validator";
import { and, eq, gt, inArray, isNotNull, isNull, like, or } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const createUserShcema = insertUserSchema.extend({
  activeTill: z.any().optional(),
});

const isRoleName = (role?: string): role is RoleName => {
  if (!role) return false;
  return Object.values(RoleName).includes(role as RoleName);
};

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
  .patch(
    "/:id",
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
      const userId = ctx.req.param("id");
      const values = ctx.req.valid("json");
      console.log({ values });
      const user = await db
        .update(users)
        .set({
          ...values,
          activeTill: values.activeTill ? new Date(values.activeTill) : null,
        })
        .where(eq(users.id, userId));
      return ctx.json({ data: user });
    }
  )
  .get("/:id/departments", async (ctx) => {
    const userId = ctx.req.param("id");
    const userWithDepartments = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        departmentsLeading: {
          with: {
            department: {
              columns: { name: true, id: true },
            },
          },
        },
      },
    });

    if (!userWithDepartments) {
      return ctx.json({ error: "User not found" }, 404);
    }

    const departments = userWithDepartments.departmentsLeading.map(
      ({ department }) => department
    );
    departments.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return ctx.json({ data: departments });
  })
  .get("/search/:keyword/role/:role?", async (ctx) => {
    const keyword = ctx.req.param("keyword");
    const role = ctx.req.param("role");

    const validRole = isRoleName(role) ? role : undefined;

    const results = await db.query.users.findMany({
      where: and(
        like(users.name, `%${keyword}%`),
        !!validRole ? eq(users.role, validRole) : undefined,
        or(gt(users.activeTill, new Date()), isNull(users.activeTill))
      ),
      columns: { id: true, name: true },
      orderBy: users.name,
    });

    return ctx.json({ data: results ?? [] });
  });

export default app;
