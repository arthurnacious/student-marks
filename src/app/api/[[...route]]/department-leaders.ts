// departments.ts
import { db } from "@/db";
import {
  departments,
  departmentLeadersToDepartments,
  courses,
  insertDepartmentLeadersToDepartmentSchema,
  insertDepartmentSchema,
  lecturersToDepartments,
} from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

const app = new Hono()
  .get("/:id", async (ctx) => {
    const departmentId = ctx.req.param("id");

    const data = await db.query.departmentLeadersToDepartments.findMany({
      where: eq(lecturersToDepartments.departmentId, departmentId),
      with: {
        leader: true,
      },
    });
    return ctx.json({ data });
  })
  .post(
    "/:id/assign",
    zValidator(
      "json",
      insertDepartmentLeadersToDepartmentSchema.pick({
        departmentLeaderId: true,
      })
    ),
    async (ctx) => {
      const departmentId = ctx.req.param("id");
      const { departmentLeaderId } = ctx.req.valid("json");

      const [existingName] = await db
        .select()
        .from(departmentLeadersToDepartments)
        .where(
          and(
            eq(
              departmentLeadersToDepartments.departmentLeaderId,
              departmentLeaderId
            ),
            eq(departmentLeadersToDepartments.departmentId, departmentId)
          )
        );

      if (existingName) {
        return ctx.json({ name: "user Already assigned" }, 422);
      }

      const data = await db.insert(departmentLeadersToDepartments).values({
        departmentLeaderId,
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
          .delete(departmentLeadersToDepartments)
          .where(inArray(departmentLeadersToDepartments.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
