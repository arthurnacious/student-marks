// class-sessions.ts
import { db } from "@/db";
import { classSessions, classes, insertClassSessionSchema } from "@/db/schema";
import { toTitleCase } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .post(
    "/:classId",
    zValidator("json", insertClassSessionSchema.pick({ name: true })),
    async (ctx) => {
      const { name } = ctx.req.valid("json");
      const classId = ctx.req.param("classId");
      // const session = await auth();
      // if (!session?.user) {
      //   return ctx.json({ error: "Unauthorized" }, 401);
      // }

      const existingClass = await db.query.classes.findFirst({
        where: eq(classes.id, classId),
        columns: {
          id: true,
        },
      });

      if (!existingClass) {
        return ctx.json({ error: "class not found" }, 404);
      }

      const existingSession = await db.query.classSessions.findFirst({
        where: and(eq(classes.id, classId), eq(classSessions.name, name)),
        columns: {
          id: true,
        },
      });

      if (existingSession) {
        return ctx.json({ error: "Session already exists" }, 422);
      }

      try {
        const data = await db
          .insert(classSessions)
          .values({ name: toTitleCase(name), classId });

        return ctx.json({ data });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .post(
    "/:id/sessions/bulk-delete",
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
          .delete(classSessions)
          .where(inArray(classSessions.id, ids));

        return ctx.json({ data: ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .get("/:classId", async (ctx) => {
    const classId = ctx.req.param("classId");
    // const session = await auth();
    // if (!session?.user) {
    //   return ctx.json({ error: "Unauthorized" }, 401);
    // }

    const data = await db.query.classSessions.findMany({
      where: eq(classSessions.classId, classId),
      with: {
        attendances: true,
      },
      columns: {
        id: true,
        name: true,
      },
    });
    return ctx.json({ data });
  });

export default app;
