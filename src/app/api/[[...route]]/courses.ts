// courses.ts
import { db } from "@/db";
import {
  academies,
  classes,
  courses,
  fields,
  insertCourseSchema,
  insertFieldSchema,
  insertMaterialSchema,
  materials,
} from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { and, count, eq, inArray, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

const createCourseSchema = insertCourseSchema.extend({
  academy: z.string(),
});

const updateCourseSchema = insertCourseSchema;
const createMaterialSchema = insertMaterialSchema;
const createFieldSchema = insertFieldSchema;

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
        academy: {
          name: academies.name,
        },
        classes: count(classes.id),
        fields: count(fields.id),
      })
      .from(courses)
      .leftJoin(academies, eq(courses.academyId, academies.id))
      .leftJoin(classes, eq(courses.id, classes.courseId))
      .leftJoin(fields, eq(courses.id, fields.courseId))
      .groupBy(courses.id);

    return ctx.json({ data });
  })
  .post(
    "/",
    zValidator("json", createCourseSchema.pick({ name: true, academy: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");
      let slug = slugify(values.name.toLowerCase());
      let counter = 1;
      let isSlugAvailable = false;
      values.name = toTitleCase(values.name);

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
        values.name = toTitleCase(values.name);

        const data = await db
          .insert(courses)
          .values({ ...values, slug, academyId: values.academy });

        return ctx.json({ data });
      } catch (error: any) {}
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
  .get("/:slug/fields", async (ctx) => {
    const slug = ctx.req.param("slug");
    const data = await db.query.courses.findFirst({
      where: eq(courses.slug, slug),
      columns: {
        name: true,
        id: true,
        slug: true,
      },
      with: {
        fields: true,
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
        const price = values.price * 100;
        const courseId = data.id;
        const name = toTitleCase(values.name);

        const response = await db.insert(materials).values({
          ...values,
          courseId,
          price,
          name,
        });
        return ctx.json({ data: response });
      } catch (error: any) {
        console.log({ error });
      }
      return ctx.json({ data });
    }
  )
  .post(
    "/:slug/fields",
    zValidator("json", createFieldSchema.pick({ name: true, total: true })),
    async (ctx) => {
      const slug = ctx.req.param("slug");
      const values = ctx.req.valid("json");
      const course = await db.query.courses.findFirst({
        where: eq(courses.slug, slug),
        columns: {
          id: true,
          name: true,
        },
        extras: {
          classCount: sql<number>`(
          select count(*)
          from ${classes}
          where classes.courseId = courses.id
        )`.as("classCount"),
        },
      });
      if (!course) {
        return ctx.json({ error: "Course not found" }, 404);
      }

      const errors = [];

      if (course.classCount > 0) {
        errors.push({ error: "This course has classes" });
      }

      const name = toTitleCase(values.name);
      const courseId = course.id;

      const [existingName] = await db
        .select({ name: fields.name, id: fields.id })
        .from(fields)
        .where(and(eq(fields.name, name), eq(fields.courseId, courseId)));

      if (existingName) {
        errors.push({
          name: ` ${
            course.name
          } can't have two "${name.toLocaleLowerCase()}" fields`,
        });
      }

      if (errors.length > 0) {
        return ctx.json({ errors }, 422);
      }

      try {
        const response = await db.insert(fields).values({
          ...values,
          courseId,
          name,
        });
        return ctx.json({ data: response });
      } catch (error: any) {
        console.log({ error });
      }
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
      const { ids } = ctx.req.valid("json");
      console.log({ ids });
      try {
        const data = await db.delete(courses).where(inArray(courses.id, ids));

        return ctx.json({ data: ids });
      } catch (error: any) {}
    }
  );

export default app;
