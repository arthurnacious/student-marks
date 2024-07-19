// class-notes.ts
import { db } from "@/db";
import { classNotes, insertClassNotesSchema } from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/:classId", async (ctx) => {
    const classId = ctx.req.param("classId");
    const session = await auth();
    if (!session?.user) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.query.classNotes.findMany({
      where: eq(classNotes.classId, classId),
      orderBy: classNotes.createdAt,
    });

    return ctx.json({ data });
  })
  .post(
    "/:classId",
    zValidator(
      "json",
      insertClassNotesSchema.pick({
        body: true,
      })
    ),
    async (ctx) => {
      const classId = ctx.req.param("classId");
      const { body } = ctx.req.valid("json");

      const session = await auth();
      if (!session?.user) {
        return ctx.json({ error: "Unauthorized" }, 401);
      }

      const data = await db.insert(classNotes).values({
        body,
        classId,
        // userId: session.user.id,
      });

      return ctx.json({ data });
    }
  )
  .get("/:classId/:nodeId", async (ctx) => {
    const classId = ctx.req.param("classId");
    const noteId = ctx.req.param("noteId");

    const data = await db.query.classNotes.findFirst({
      where: and(
        eq(classNotes.classId, classId),
        eq(classNotes.id, noteId as string)
      ),
    });

    return ctx.json({ data: data });
  })
  .delete("/:noteId", async (ctx) => {
    const noteId = ctx.req.param("noteId");
    console.log({ noteId });
    try {
      const data = await db.delete(classNotes).where(eq(classNotes.id, noteId));

      return ctx.json({ data });
    } catch (error: any) {
      console.error("Error processing request:", error);
      return ctx.json({ error: "Internal server error" }, 500);
    }
  });

export default app;
