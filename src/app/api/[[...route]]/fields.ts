// courses.ts
import { db } from "@/db";
import { courses, fields, insertFieldSchema } from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, ne } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const createUpdateSchema = insertFieldSchema;

const app = new Hono()
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

      try {
        const data = await db.delete(fields).where(inArray(fields.id, ids));

        return ctx.json({ data: ids });
      } catch (error: any) {
        console.log({ error });
      }
    }
  )
  .get("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    try {
      const data = await db.query.fields.findFirst({
        where: eq(fields.id, id),
      });

      return ctx.json({ data });
    } catch (error: any) {}
  })
  .patch(
    "/:id",
    zValidator("json", createUpdateSchema.pick({ name: true, total: true })),
    async (ctx) => {
      const id = ctx.req.param("id");
      const values = ctx.req.valid("json");
      const name = toTitleCase(values.name);
      const errors = [];

      const [currentField] = await db
        .select({ name: fields.name, id: fields.id, courseId: fields.courseId })
        .from(fields)
        .where(eq(fields.id, id));

      if (!currentField) {
        return ctx.json({ errors: "field not found" }, 404);
      }

      const course = await db.query.courses.findFirst({
        where: eq(courses.id, currentField.courseId),
        columns: {
          id: true,
          name: true,
        },
      });

      const [existingName] = await db
        .select()
        .from(fields)
        .where(
          and(
            eq(fields.name, name),
            eq(fields.courseId, currentField.courseId),
            ne(fields.id, currentField.id)
          )
        );

      if (existingName) {
        errors.push({
          name: ` ${
            course?.name ?? "course"
          } already has a field with the name ${name.toLocaleLowerCase()}`,
        });
      }

      if (errors.length > 0) {
        return ctx.json({ errors }, 422);
      }

      try {
        const response = await db
          .update(fields)
          .set({
            ...values,
            name,
          })
          .where(eq(fields.id, id));

        return ctx.json({ data: response });
      } catch (error: any) {
        console.log({ error });
      }
    }
  )
  .delete("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    try {
      const data = await db.delete(fields).where(eq(fields.id, id));

      return ctx.json({ data });
    } catch (error: any) {}
  });

export default app;
