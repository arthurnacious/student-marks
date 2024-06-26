// class-sessions.ts
import { db } from "@/db";
import {
  classSessions,
  classes,
  insertMaterialClassStudentSchema,
  materialsClassStudent,
} from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const toggleMaterialSTudentSchema = insertMaterialClassStudentSchema.extend({
  taken: z.boolean(),
});

const app = new Hono().post(
  "/:classId/toggle-student",
  zValidator(
    "json",
    toggleMaterialSTudentSchema.pick({
      studentId: true,
      materialId: true,
      taken: true,
    })
  ),
  async (ctx) => {
    const { studentId, materialId } = ctx.req.valid("json");
    const classId = ctx.req.param("classId");
    // const session = await auth();
    // if (!session?.user) {
    //   return ctx.json({ error: "Unauthorized" }, 401);
    // }
    try {
      const existingSTudentMaterial =
        await db.query.materialsClassStudent.findFirst({
          where: and(
            eq(materialsClassStudent.studentId, studentId),
            eq(materialsClassStudent.materialId, materialId),
            eq(materialsClassStudent.classId, classId)
          ),
          columns: {
            id: true,
          },
        });

      let data;
      if (existingSTudentMaterial) {
        data = await db
          .delete(materialsClassStudent)
          .where(
            and(
              eq(materialsClassStudent.studentId, studentId),
              eq(materialsClassStudent.materialId, materialId),
              eq(materialsClassStudent.classId, classId)
            )
          );
      } else {
        data = await db.insert(materialsClassStudent).values({
          studentId,
          materialId,
          classId,
        });
      }

      return ctx.json({ data });
    } catch (error: any) {
      console.error("Error processing request:", error);
      return ctx.json({ error: "Internal server error" }, 500);
    }
  }
);

export default app;
