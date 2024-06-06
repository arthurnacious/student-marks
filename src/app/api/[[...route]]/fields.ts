// courses.ts
import { db } from "@/db";
import { fields, insertFieldSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
  .post(
    "/:courseId",
    zValidator("json", insertFieldSchema.pick({ name: true, total: true })),
    async (ctx) => {
      const { name, total } = ctx.req.valid("json");
      const courseId = ctx.req.param("courseId");

      const [existingName] = await db
        .select()
        .from(fields)
        .where(and(eq(fields.name, name), eq(fields.courseId, courseId)));

      if (existingName) {
        return ctx.json({ name: "name already taken" }, 422);
      }

      try {
        const data = await db.insert(fields).values({ name, courseId, total });

        return ctx.json({ data });
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
