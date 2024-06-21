// courses.ts
import { db } from "@/db";
import {
  classes,
  courses,
  fields,
  insertCourseSchema,
  insertMaterialSchema,
  materials,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, count, eq, inArray, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

const createCourseSchema = insertCourseSchema.extend({
  fields: z.array(
    z.object({
      name: z.string().min(1, {
        message: "Field name is required",
      }),
      total: z.number().min(1, {
        message: "Total is required",
      }),
    })
  ),
  academy: z.string(),
});

const updateCourseSchema = insertCourseSchema;

const createMaterialSchema = insertMaterialSchema;

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
    zValidator(
      "json",
      createCourseSchema.pick({ name: true, fields: true, academy: true })
    ),
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

        await db
          .insert(courses)
          .values({ ...rest, slug, academyId: values.academy });
        const [courseData] = await db
          .select({ id: courses.id })
          .from(courses)
          .where(eq(courses.slug, slug));

        // Insert the fields data concurrently
        const fieldsData = await Promise.all(
          fieldsArray.map(async ({ name, total }) => {
            if (name !== "") {
              await db
                .insert(fields)
                .values({ name, total, courseId: courseData.id });
            }
          })
        );

        return ctx.json({ courseData, fieldsData });
      } catch (error: any) {
        // if (error.code === "DUP") {
        //   throw new Error({ title: "Duplicate name", statusCode: 422 });
        // }
      }
    }
  )
  .get("/:slug", async (ctx) => {
    const slug = ctx.req.param("slug");
    const data = await db.query.courses.findFirst({
      where: eq(courses.slug, slug),
      with: {
        fields: true,
        academy: {
          columns: {
            name: true,
          },
        },
        materials: true,
      },
      extras: {
        classCount: sql<number>`(
          select count(*)
          from ${classes}
          where classes.courseId = courses.id
        )`.as("classCount"),
      },
    });
    return ctx.json({ data });
  })
  .get("/:slug/materials", async (ctx) => {
    const slug = ctx.req.param("slug");
    const data = await db.query.courses.findFirst({
      where: eq(courses.slug, slug),
      columns: {
        name: true,
        id: true,
        slug: true,
      },
      with: {
        materials: true,
      },
    });
    return ctx.json({ data });
  })
  .post(
    "/:slug/materials",
    zValidator(
      "json",
      createMaterialSchema.pick({ name: true, price: true, amount: true })
    ),
    async (ctx) => {
      const slug = ctx.req.param("slug");
      const values = ctx.req.valid("json");
      const data = await db.query.courses.findFirst({
        where: eq(courses.slug, slug),
        columns: {
          id: true,
        },
      });

      if (!data) {
        return ctx.json({ error: "Course not found" }, 404);
      }

      try {
        const response = await db
          .insert(materials)
          .values({ ...values, courseId: data.id, price: values.price * 100 });
        return ctx.json({ data: response });
      } catch (error: any) {
        console.log({ error });
      }
      return ctx.json({ data });
    }
  )
  .patch(
    "/:slug",
    zValidator("json", updateCourseSchema.pick({ name: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");

      const slug = ctx.req.param("slug");
      const newSlug = slugify(values.name.toLowerCase());

      const course = await db.query.courses.findFirst({
        where: eq(courses.slug, slug),
      });

      if (!course) {
        return ctx.json({ error: "Not Found" }, 404);
      }

      const [existingName] = await db
        .select()
        .from(courses)
        .where(and(eq(courses.name, values.name), ne(courses.slug, slug)));

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      try {
        const [data] = await db
          .update(courses)
          .set({ ...values, slug: newSlug })
          .where(eq(courses.id, course.id));

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
          .delete(courses)
          .where(inArray(courses.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {}
    }
  );

export default app;
