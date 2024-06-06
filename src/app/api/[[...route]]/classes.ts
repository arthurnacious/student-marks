// courses.ts
import { db } from "@/db";
import { classes, courses, insertClassesSchema, users } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";
import { Hono } from "hono";
import slugify from "slugify";

const app = new Hono()
  .get("/", async (ctx) => {
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
      const userId = "39cc2560-ca08-4c75-bf10-093400c2a27d";

      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
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
        await db.insert(classes).values({ ...values, slug, creatorId: userId });

        return ctx.json({ data: slug });
      } catch (error: any) {
        // if (error.code === "DUP") {
        //   throw new Error({ title: "Duplicate name", statusCode: 422 });
        // }
      }
    }
  );

export default app;
