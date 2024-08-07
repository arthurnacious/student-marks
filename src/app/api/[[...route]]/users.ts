// users.ts
import { db } from "@/db";
import {
  insertUserSchema,
  users,
  departments,
  departmentLeadersToDepartments,
  lecturersToDepartments,
} from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { RoleName } from "@/types/roles";
import { zValidator } from "@hono/zod-validator";
import {
  and,
  asc,
  eq,
  gt,
  inArray,
  isNotNull,
  isNull,
  like,
  or,
} from "drizzle-orm";
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

    // First, fetch the user to check their role
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { role: true },
    });

    if (!user) {
      return ctx.json({ error: "User not found" }, 404);
    }

    let userDepartments;

    switch (user.role) {
      case RoleName.ADMIN:
      case RoleName.STUDENT:
      case RoleName.FINANCE:
        // fetch all departments from all academies
        userDepartments = await db
          .select({
            id: departments.id,
            name: departments.name,
          })
          .from(departments)
          .orderBy(asc(departments.name));
        break;

      case RoleName.DEPARTMENTLEADER:
        // fetch departments led by this department leader
        userDepartments = await db
          .select({
            id: departments.id,
            name: departments.name,
          })
          .from(departmentLeadersToDepartments)
          .innerJoin(
            departments,
            eq(departments.id, departmentLeadersToDepartments.departmentId)
          )
          .where(eq(departmentLeadersToDepartments.departmentLeaderId, userId))
          .orderBy(asc(departments.name));
        break;

      case RoleName.LECTURER:
        // fetch departments the lecturer is associated with
        userDepartments = await db
          .select({
            id: departments.id,
            name: departments.name,
          })
          .from(lecturersToDepartments)
          .innerJoin(
            departments,
            eq(departments.id, lecturersToDepartments.departmentId)
          )
          .where(eq(lecturersToDepartments.lecturerId, userId))
          .orderBy(asc(departments.name));
        break;

      default:
        return ctx.json({ error: "Invalid user role" }, 403);
    }

    return ctx.json({ data: userDepartments });
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
