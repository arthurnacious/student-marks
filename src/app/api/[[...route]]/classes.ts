// courses.ts
import { db } from "@/db";
import {
  attendances,
  classSessions,
  classes,
  courses,
  insertAttendanceSchema,
  insertClassesSchema,
  insertStudentsToClasses,
  sessions,
  studentsToClasses,
  users,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { formatDate } from "date-fns";
import { and, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

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
          sql<number>`(select count(*) from ${studentsToClasses} where studentToClasses.classId = ${classes.id})`.as(
            "students"
          ),
        sessions:
          sql<number>`(select count(*) from ${classSessions} where classSessions.classId = ${classes.id})`.as(
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
        course: {
          with: {
            fields: {
              with: {
                marks: true,
              },
            },
            materials: true,
          },
        },
        materials: true,
        lecturer: true,
        students: {
          with: {
            student: true,
          },
        },
        sessions: {
          with: {
            attendances: true,
          },
          orderBy: classSessions.createdAt,
        },
        payments: true,
      },
    });

    return ctx.json({ data: data });
  })
  .post(
    "/",
    zValidator(
      "json",
      insertClassesSchema.pick({ courseId: true, notes: true, type: true })
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
          price: true,
        },
      });

      if (!course) {
        return ctx.json({ error: "course not found" }, 404);
      }

      try {
        const date = new Date();
        const price = course.price ?? 0;
        const randomNumber = Math.floor(Math.random() * (5000 - 1000)) + 1000;
        let slug = slugify(
          `${course.name}-${user.name}-${formatDate(
            date,
            "yyyy-MM-dd"
          )}-${randomNumber}`.toLowerCase()
        );
        await db
          .insert(classes)
          .values({ ...values, price, slug, creatorId: user.id });

        return ctx.json({ slug });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
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
      try {
        const data = await db.delete(classes).where(inArray(classes.id, ids));

        return ctx.json({ data: ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .post(
    "/:classId/attendance",
    zValidator(
      "json",
      insertAttendanceSchema.pick({
        role: true,
        studentId: true,
        classSessionId: true,
      })
    ),
    async (ctx) => {
      const { studentId, role, classSessionId } = ctx.req.valid("json");
      const classId = ctx.req.param("classId");
      // const session = await auth();
      // if (!session?.user) {
      //   return ctx.json({ error: "Unauthorized" }, 401);
      // }

      try {
        const exisitngAttenance = await db.query.attendances.findFirst({
          where: and(
            eq(attendances.studentId, studentId),
            eq(attendances.classSessionId, classSessionId)
          ),
          columns: {
            id: true,
          },
        });

        if (exisitngAttenance) {
          const [data] = await db
            .update(attendances)
            .set({ role })
            .where(
              and(
                eq(attendances.studentId, studentId),
                eq(attendances.classSessionId, classSessionId)
              )
            );
          return ctx.json({ data });
        } else {
          const data = await db
            .insert(attendances)
            .values({ studentId, role, classSessionId });
          return ctx.json({ data });
        }
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
