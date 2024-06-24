// course-students.ts
import { db } from "@/db";
import { insertStudentsToClasses, studentsToClasses } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .post(
    "/:id/students/add",
    zValidator("json", insertStudentsToClasses.pick({ studentId: true })),
    async (ctx) => {
      const classId = ctx.req.param("id");
      const { studentId } = ctx.req.valid("json");

      const existingStudent = await db.query.studentsToClasses.findFirst({
        where: and(
          eq(studentsToClasses.classId, classId),
          eq(studentsToClasses.studentId, studentId)
        ),
        columns: {
          id: true,
        },
      });

      if (existingStudent) {
        return ctx.json({ error: "Student already enrolled for class" }, 422);
      }

      const data = await db
        .insert(studentsToClasses)
        .values({ studentId, classId });

      return ctx.json({ data });
    }
  )
  .post(
    "/:id/students/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (ctx) => {
      const classId = ctx.req.param("id");
      const { ids } = ctx.req.valid("json");

      try {
        const data = await db
          .delete(studentsToClasses)
          .where(inArray(studentsToClasses.id, ids));

        return ctx.json({ data: ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
