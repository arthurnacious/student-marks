// courses.ts
import { db } from "@/db";
import {
  classSessions,
  classes,
  courses,
  insertClassesSchema,
  studentsToClasses,
  users,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { formatDate } from "date-fns";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";

const app = new Hono()
  .get("/", async (ctx) => {
    const session = await auth();
    if (!session?.user) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.query.classes.findMany({
      with: {
        course: {
          columns: {
            name: true,
          },
        },
        lecturer: {
          columns: {
            name: true,
          },
        },
      },
      extras: {
        students:
          sql<number>`(select count(*) from ${studentsToClasses} where 'studentsToClasses.classId' = ${classes.id})`.as(
            "students"
          ),
        sessions:
          sql<number>`(select count(*) from ${classSessions} where 'classSessions.classId' = ${classes.id})`.as(
            "sessions"
          ),
      },
    });

    return ctx.json({ data });
  })
  .get("/:slug", async (ctx) => {
    const slug = ctx.req.param("slug");

    const data = await db.query.classes.findFirst({
      where: eq(classes.slug, slug),
      with: {
        course: true,
        lecturer: true,
        students: true,
        payments: true,
      },
    });

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
        const randomNumber = Math.floor(Math.random() * (5000 - 1000)) + 1000;
        let slug = slugify(
          `${course.name}-${user.name}-${formatDate(
            date,
            "yyyy-MM-dd"
          )}-${randomNumber}`.toLowerCase()
        );
        await db
          .insert(classes)
          .values({ ...values, slug, creatorId: user.id });

        return ctx.json({ data: slug });
      } catch (error: any) {}
    }
  );

export default app;
