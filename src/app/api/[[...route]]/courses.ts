// courses.ts
import { db } from "@/db";
import { classes, courses, fields, insertCourseSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { count, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

const createAcademySchema = insertCourseSchema.extend({
  fields: z.array(z.string()),
});

const app = new Hono()
  .get("/", async (ctx) => {
    const data = await db
      .select({
        id: courses.id,
        name: courses.name,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        slug: courses.slug,
        status: courses.status,
        classes: count(classes.id),
        fields: count(fields.id),
      })
      .from(courses)
      .leftJoin(classes, eq(courses.id, classes.courseId))
      .leftJoin(fields, eq(courses.id, fields.courseId))
      .groupBy(courses.id);

    return ctx.json({ data });
  })
  .post(
    "/",
    zValidator("json", createAcademySchema.pick({ name: true, fields: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");
      let slug = slugify(values.name.toLowerCase());
      let counter = 1;
      let isSlugAvailable = false;

      const [existingName] = await db
        .select()
        .from(courses)
        .where(eq(courses.name, values.name));

      while (!isSlugAvailable) {
        const [result] = await db
          .select({ name: courses.name })
          .from(courses)
          .where(eq(courses.slug, slug));

        if (result) {
          // Slug already exists, increment the counter and create a new slug
          slug = `${slugify(values.name.toLowerCase())}-${counter}`;
          counter++;
        } else {
          // Slug is available
          isSlugAvailable = true;
        }
      }

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      try {
        const { fields: fieldsArray, ...rest } = values;

        await db.insert(courses).values({ slug, ...rest });
        const [courseData] = await db
          .select({ id: courses.id })
          .from(courses)
          .where(eq(courses.slug, slug));

        // Insert the fields data concurrently
        const fieldsData = await Promise.all(
          fieldsArray.map((name) =>
            db.insert(fields).values({ name, courseId: courseData.id })
          )
        );

        return ctx.json({ courseData, fieldsData });
      } catch (error: any) {
        // if (error.code === "DUP") {
        //   throw new Error({ title: "Duplicate name", statusCode: 422 });
        // }
      }
    }
  )
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`))
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
          .delete(courses)
          .where(inArray(courses.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {}
    }
  );

export default app;
