// class-sessions.ts
import { db } from "@/db";
import {
  classSessions,
  classes,
  insertMaterialClassStudentSchema,
  materials,
  materialsClassStudent,
} from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, sql } from "drizzle-orm";
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

    const material = await db.query.materials.findFirst({
      where: eq(materials.id, materialId),
      columns: {
        price: true,
      },
    });

    try {
      const existingStudentMaterial =
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
      let materialAction: "subract" | "add" = "subract";
      if (existingStudentMaterial) {
        materialAction = "add";
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
          price: material?.price ?? 0,
        });
      }
      const sqlData = await db
        .update(materials)
        .set({
          amount: sql`${
            materialAction === "add"
              ? sql`${materials.amount} + 1`
              : sql`CASE WHEN ${materials.amount} > 0 THEN ${materials.amount} - 1 ELSE ${materials.amount} END`
          }`,
        })
        .where(eq(materials.id, materialId));

      return ctx.json({ data });
    } catch (error: any) {
      console.error("Error processing request:", error);
      return ctx.json({ error: "Internal server error" }, 500);
    }
  }
);

export default app;
