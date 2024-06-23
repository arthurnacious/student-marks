// class-sessions.ts
import { db } from "@/db";
import { classSessions, classes, insertClassSessionSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
  .post(
    "/:classId",
    zValidator("json", insertClassSessionSchema.pick({ name: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");
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
        where: and(
          eq(classes.id, classId),
          eq(classSessions.name, values.name)
        ),
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
          .values({ ...values, classId });

        return ctx.json({ data });
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
