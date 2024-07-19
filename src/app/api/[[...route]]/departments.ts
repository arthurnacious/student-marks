// departments.ts
import { db } from "@/db";
import {
  departments,
  courses,
  insertDepartmentSchema,
  lecturersToDepartments,
} from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

const app = new Hono()
  .get("/", async (ctx) => {
    const data = await db
      .select({
        id: departments.id,
        name: departments.name,
        slug: departments.slug,
        _count: {
          courses: sql<number>`count(${courses.departmentId})`,
          lecturers: sql<number>`count(${lecturersToDepartments.departmentId})`,
        },
      })
      .from(departments)
      .leftJoin(courses, eq(departments.id, courses.departmentId))
      .leftJoin(
        lecturersToDepartments,
        eq(departments.id, lecturersToDepartments.departmentId)
      )
      .groupBy(departments.id)
      .orderBy(departments.name);

    return ctx.json({ data });
  })
  .post(
    "/",
    zValidator("json", insertDepartmentSchema.pick({ name: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");
      let slug = slugify(values.name.toLowerCase());
      values.name = toTitleCase(values.name);

      const [existingName] = await db
        .select()
        .from(departments)
        .where(eq(departments.name, values.name));

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      const data = await db.insert(departments).values({ slug, ...values });

      return ctx.json({ data });
    }
  )
  .get("/:slug", async (ctx) => {
    const slug = ctx.req.param("slug");
    const data = await db.query.departments.findFirst({
      where: eq(departments.slug, slug),
      with: {
        leaders: true,
        lecturers: true,
      },
    });
    return ctx.json({ data });
  })
  .patch(
    "/:slug",
    zValidator("json", insertDepartmentSchema.pick({ name: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");

      const slug = ctx.req.param("slug");
      const newSlug = slugify(values.name.toLowerCase());

      const [existingName] = await db
        .select()
        .from(departments)
        .where(
          and(eq(departments.name, values.name), ne(departments.slug, slug))
        );

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      const [data] = await db
        .update(departments)
        .set({ ...values, slug: newSlug })
        .where(eq(departments.slug, slug));

      return ctx.json({ data });
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
      const values = ctx.req.valid("json");

      try {
        const data = await db
          .delete(departments)
          .where(inArray(departments.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .get("/:id/courses", async (ctx) => {
    const departmentId = ctx.req.param("id");
    const data = await db.query.courses.findMany({
      where: eq(courses.departmentId, departmentId),
    });
    return ctx.json({ data });
  })
  .get("/:id/lecturers", async (ctx) => {
    const departmentId = ctx.req.param("id");
    const data = await db.query.lecturersToDepartments.findMany({
      where: eq(lecturersToDepartments.departmentId, departmentId),
      with: {
        lecturer: true,
      },
    });

    return ctx.json({ data });
  });

export default app;
