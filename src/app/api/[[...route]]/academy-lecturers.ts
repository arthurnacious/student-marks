//academy-lecturer.ts
import { db } from "@/db";
import {
  academyHeadsToAcademies,
  insertLecturersToAcademySchema,
  lecturersToAcademies,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/:id", async (ctx) => {
    const academyId = ctx.req.param("id");

    const data = await db.query.lecturersToAcademies.findMany({
      where: eq(lecturersToAcademies.academyId, academyId),
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
      insertLecturersToAcademySchema.pick({ lecturerId: true })
    ),
    async (ctx) => {
      const academyId = ctx.req.param("id");
      const { lecturerId } = ctx.req.valid("json");
      console.log({ lecturerId });

      const [existingName] = await db
        .select()
        .from(lecturersToAcademies)
        .where(
          and(
            eq(lecturersToAcademies.lecturerId, lecturerId),
            eq(lecturersToAcademies.academyId, academyId)
          )
        );

      if (existingName) {
        return ctx.json({ name: "user Already assigned" }, 422);
      }

      const data = await db.insert(lecturersToAcademies).values({
        lecturerId,
        academyId,
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
          .delete(lecturersToAcademies)
          .where(inArray(lecturersToAcademies.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
