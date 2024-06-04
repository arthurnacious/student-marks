// academies.ts
import { db } from "@/db";
import {
  academies,
  academyHeadsToAcademies,
  courses,
  insertAcademySchema,
  lecturersToAcademies,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

const updateAcademyShcema = insertAcademySchema.extend({
  heads: z.array(z.string()),
  lecturers: z.array(z.string()),
});

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
      let counter = 1;
      let isSlugAvailable = false;

      // while (!isSlugAvailable) {
      //   const [result] = await db
      //     .select({ name: academies.name })
      //     .from(academies)
      //     .where(eq(academies.slug, slug));

      //   if (result) {
      //     // Slug already exists, increment the counter and create a new slug
      //     slug = `${slugify(values.name.toLowerCase())}-${counter}`;
      //     counter++;
      //   } else {
      //     // Slug is available
      //     isSlugAvailable = true;
      //   }
      // }

      const [existingName] = await db
        .select()
        .from(academies)
        .where(eq(academies.name, values.name));

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      try {
        const data = await db.insert(academies).values({ slug, ...values });

        return ctx.json({ data });
      } catch (error: any) {
        // if (error.code === "DUP") {
        //   throw new Error({ title: "Duplicate name", statusCode: 422 });
        // }
      }
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
    zValidator(
      "json",
      updateAcademyShcema.pick({ name: true, heads: true, lecturers: true })
    ),
    async (ctx) => {
      const { heads, lecturers, ...values } = ctx.req.valid("json");

      const slug = ctx.req.param("slug");
      const newSlug = slugify(values.name.toLowerCase());

      const [existingName] = await db
        .select()
        .from(academies)
        .where(and(eq(academies.name, values.name), ne(academies.slug, slug)));

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      try {
        const academy = await db.query.academies.findFirst({
          where: eq(academies.slug, slug),
        });

        if (!academy) {
          return ctx.json({ error: "Not Found" }, 404);
        }

        const academyId = academy.id;

        const [data] = await db
          .update(academies)
          .set({ ...values, slug: newSlug })
          .where(eq(academies.id, academyId));

        //update academy heads and lecurers
        await db
          .delete(academyHeadsToAcademies)
          .where(eq(academyHeadsToAcademies.academyId, academyId));

        heads.forEach(async (academyHeadId) => {
          await db
            .insert(academyHeadsToAcademies)
            .values({ academyHeadId, academyId });
        });

        await db
          .delete(lecturersToAcademies)
          .where(eq(lecturersToAcademies.academyId, academyId));

        lecturers.forEach(async (lecturerId) => {
          await db
            .insert(lecturersToAcademies)
            .values({ lecturerId, academyId });
        });

        return ctx.json({ data });
      } catch (error: any) {
        console.log({ error: error });
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
      const values = ctx.req.valid("json");

      try {
        const data = await db
          .delete(academies)
          .where(inArray(academies.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {}
    }
  )
  .get("/:id/courses", async (ctx) => {
    const academyId = ctx.req.param("id");
    const data = await db.query.courses.findMany({
      where: eq(courses.academyId, academyId),
    });
    return ctx.json({ data });
  })
  .get("/:id/academy-heads", async (ctx) => {
    const academyId = ctx.req.param("id");

    const data = await db.query.academyHeadsToAcademies.findMany({
      where: eq(lecturersToAcademies.academyId, academyId),
      with: {
        head: true,
      },
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
