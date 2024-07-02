// academies.ts
import { db } from "@/db";
import {
  academies,
  academyHeadsToAcademies,
  courses,
  insertAcademySchema,
  lecturersToAcademies,
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
        id: academies.id,
        name: academies.name,
        slug: academies.slug,
        _count: {
          courses: sql<number>`count(${courses.academyId})`,
          lecturers: sql<number>`count(${lecturersToAcademies.academyId})`,
        },
      })
      .from(academies)
      .leftJoin(courses, eq(academies.id, courses.academyId))
      .leftJoin(
        lecturersToAcademies,
        eq(academies.id, lecturersToAcademies.academyId)
      )
      .groupBy(academies.id)
      .orderBy(academies.name);

    return ctx.json({ data });
  })
  .post(
    "/",
    zValidator("json", insertAcademySchema.pick({ name: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");
      let slug = slugify(values.name.toLowerCase());
      values.name = toTitleCase(values.name);

      const [existingName] = await db
        .select()
        .from(academies)
        .where(eq(academies.name, values.name));

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      const data = await db.insert(academies).values({ slug, ...values });

      return ctx.json({ data });
    }
  )
  .get("/:slug", async (ctx) => {
    const slug = ctx.req.param("slug");
    const data = await db.query.academies.findFirst({
      where: eq(academies.slug, slug),
      with: {
        heads: true,
        lecturers: true,
      },
    });
    return ctx.json({ data });
  })
  .patch(
    "/:slug",
    zValidator("json", insertAcademySchema.pick({ name: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");

      const slug = ctx.req.param("slug");
      const newSlug = slugify(values.name.toLowerCase());

      const [existingName] = await db
        .select()
        .from(academies)
        .where(and(eq(academies.name, values.name), ne(academies.slug, slug)));

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      const [data] = await db
        .update(academies)
        .set({ ...values, slug: newSlug })
        .where(eq(academies.slug, slug));

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
          .delete(academies)
          .where(inArray(academies.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .get("/:id/courses", async (ctx) => {
    const academyId = ctx.req.param("id");
    const data = await db.query.courses.findMany({
      where: eq(courses.academyId, academyId),
    });
    return ctx.json({ data });
  })
  .get("/:id/lecturers", async (ctx) => {
    const academyId = ctx.req.param("id");
    const data = await db.query.lecturersToAcademies.findMany({
      where: eq(lecturersToAcademies.academyId, academyId),
      with: {
        lecturer: true,
      },
    });

    return ctx.json({ data });
  });

export default app;
