// courses.ts
import { db } from "@/db";
import {
  departments,
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
import { and, count, eq, inArray, like, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

const createCourseSchema = insertCourseSchema.extend({
  department: z.string(),
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
        price: courses.price,
        department: {
          name: departments.name,
        },
        classes: count(classes.id),
        fields: count(fields.id),
      })
      .from(courses)
      .leftJoin(departments, eq(courses.departmentId, departments.id))
      .leftJoin(classes, eq(courses.id, classes.courseId))
      .leftJoin(fields, eq(courses.id, fields.courseId))
      .orderBy(courses.name)
      .groupBy(courses.id);

    return ctx.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      createCourseSchema.pick({ name: true, department: true, price: true })
    ),
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
        values.price = values.price ? values.price * 100 : undefined;

        const data = await db
          .insert(courses)
          .values({ ...values, slug, departmentId: values.department });

        return ctx.json({ data });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .get("/:slug", async (ctx) => {
    const slug = ctx.req.param("slug");
    const data = await db.query.courses.findFirst({
      where: eq(courses.slug, slug),
      with: {
        fields: true,
        department: {
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
  .get("/search/:department/:keyword", async (ctx) => {
    const keyword = ctx.req.param("keyword");
    const departmentId = ctx.req.param("department");
    const data = await db.query.courses.findMany({
      where: and(
        like(courses.slug, `%${keyword}%`),
        eq(courses.departmentId, departmentId)
      ),
      orderBy: courses.name,
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
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
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
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .patch(
    "/:slug",
    zValidator(
      "json",
      updateCourseSchema.pick({ name: true, price: true, departmentId: true })
    ),
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

      const [data] = await db
        .update(courses)
        .set({
          ...values,
          price: values.price ? values.price * 100 : undefined,
          slug: newSlug,
        })
        .where(eq(courses.id, course.id));

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
      const { ids } = ctx.req.valid("json");

      const data = await db.delete(courses).where(inArray(courses.id, ids));

      return ctx.json({ data: ids });
    }
  );

export default app;
