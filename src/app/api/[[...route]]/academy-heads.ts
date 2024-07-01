// academies.ts
import { db } from "@/db";
import {
  academies,
  academyHeadsToAcademies,
  courses,
  insertAcademyHeadsToAcademySchema,
  insertAcademySchema,
  lecturersToAcademies,
} from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";
import { z } from "zod";

const app = new Hono()
  .get("/:id", async (ctx) => {
    const academyId = ctx.req.param("id");

    const data = await db.query.academyHeadsToAcademies.findMany({
      where: eq(lecturersToAcademies.academyId, academyId),
      with: {
        head: true,
      },
    });
    return ctx.json({ data });
  })
  .post(
    "/:id/assign",
    zValidator(
      "json",
      insertAcademyHeadsToAcademySchema.pick({ academyHeadId: true })
    ),
    async (ctx) => {
      const academyId = ctx.req.param("id");
      const { academyHeadId } = ctx.req.valid("json");
      console.log({ academyHeadId });

      const [existingName] = await db
        .select()
        .from(academyHeadsToAcademies)
        .where(
          and(
            eq(academyHeadsToAcademies.academyHeadId, academyHeadId),
            eq(academyHeadsToAcademies.academyId, academyId)
          )
        );

      if (existingName) {
        return ctx.json({ name: "user Already assigned" }, 422);
      }

      const data = await db.insert(academyHeadsToAcademies).values({
        academyHeadId,
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
          .delete(academyHeadsToAcademies)
          .where(inArray(academyHeadsToAcademies.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
