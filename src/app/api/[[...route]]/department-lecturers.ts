//department-lecturer.ts
import { db } from "@/db";
import {
  insertLecturersToDepartmentSchema,
  lecturersToDepartments,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/:id", async (ctx) => {
    const departmentId = ctx.req.param("id");

    const data = await db.query.lecturersToDepartments.findMany({
      where: eq(lecturersToDepartments.departmentId, departmentId),
      with: {
        lecturer: true,
      },
    });
    return ctx.json({ data });
  })
  .post(
    "/:id/assign",
    zValidator(
      "json",
      insertLecturersToDepartmentSchema.pick({ lecturerId: true })
    ),
    async (ctx) => {
      const departmentId = ctx.req.param("id");
      const { lecturerId } = ctx.req.valid("json");

      const [existingName] = await db
        .select()
        .from(lecturersToDepartments)
        .where(
          and(
            eq(lecturersToDepartments.lecturerId, lecturerId),
            eq(lecturersToDepartments.departmentId, departmentId)
          )
        );

      if (existingName) {
        return ctx.json({ name: "user Already assigned" }, 422);
      }

      const data = await db.insert(lecturersToDepartments).values({
        lecturerId,
        departmentId,
      });

      return ctx.json({ data });
    }
  )
  .post(
    "/:id/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (ctx) => {
      const values = ctx.req.valid("json");

      try {
        const data = await db
          .delete(lecturersToDepartments)
          .where(inArray(lecturersToDepartments.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
