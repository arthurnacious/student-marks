// academies.ts
import { db } from "@/db";
import {
  academies,
  academyHeadsToAcademies,
  courses,
  insertAcademySchema,
  lecturerToAcademy,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";

const app = new Hono()
  .get("/", async (ctx) => {
    const data = await db
      .select({
        id: academies.id,
        name: academies.name,
        slug: academies.slug,
        _count: {
          courses: sql<number>`count(${courses.academyId})`,
          asignees: sql<number>`count(${lecturerToAcademy.academyId})`,
        },
      })
      .from(academies)
      .leftJoin(courses, eq(academies.id, courses.academyId))
      .leftJoin(
        lecturerToAcademy,
        eq(academies.id, lecturerToAcademy.academyId)
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
      let slug = slugify(values.name);
      let counter = 1;
      let isSlugAvailable = false;

      // while (!isSlugAvailable) {
      //   const [result] = await db
      //     .select({ name: academies.name })
      //     .from(academies)
      //     .where(eq(academies.slug, slug));

      //   if (result) {
      //     // Slug already exists, increment the counter and create a new slug
      //     slug = `${slugify(values.name)}-${counter}`;
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
        courses: true,
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
      const newSlug = slugify(values.name);

      const [existingName] = await db
        .select()
        .from(academies)
        .where(and(eq(academies.name, values.name), ne(academies.slug, slug)));

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      try {
        const data = await db
          .update(academies)
          .set({ slug: newSlug, ...values })
          .where(eq(academies.slug, slug));
        return ctx.json({ data });
      } catch (error: any) {
        console.log({ error: error });
      }
    }
  );

export default app;
