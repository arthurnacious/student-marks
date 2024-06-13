// courses.ts
import { db } from "@/db";
import { classes, courses, insertClassesSchema, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";

const app = new Hono()
  .get("/", async (ctx) => {
    const session = await auth();
    if (!session?.user) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.query.classes.findMany({});

    return ctx.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      insertClassesSchema.pick({ courseId: true, notes: true })
    ),
    async (ctx) => {
      const values = ctx.req.valid("json");
      const session = await auth();
      if (!session?.user) {
        return ctx.json({ error: "Unauthorized" }, 401);
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id as string),
        columns: {
          id: true,
          name: true,
        },
      });

      if (!user) {
        return ctx.json({ error: "your profile not found" }, 400);
      }

      const course = await db.query.courses.findFirst({
        where: eq(courses.id, values.courseId),
        columns: {
          name: true,
        },
      });

      if (!course) {
        return ctx.json({ error: "course not found" }, 400);
      }

      try {
        const date = new Date();
        let slug = slugify(
          `${course.name}-${user.name}-${date.toISOString()}-${Math.random()}`
        );
        await db
          .insert(classes)
          .values({ ...values, slug, creatorId: user.id });

        return ctx.json({ data: slug });
      } catch (error: any) {
        // if (error.code === "DUP") {
        //   throw new Error({ title: "Duplicate name", statusCode: 422 });
        // }
      }
    }
  );

export default app;
