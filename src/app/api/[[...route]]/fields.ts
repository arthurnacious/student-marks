// courses.ts
import { db } from "@/db";
import { fields, insertFieldSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .post(
    "/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (ctx) => {
      const { ids } = ctx.req.valid("json");

      try {
        const data = await db.delete(fields).where(inArray(fields.id, ids));

        return ctx.json({ data: ids });
      } catch (error: any) {
        console.log({ error });
      }
    }
  )
  .delete("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    try {
      const data = await db.delete(fields).where(eq(fields.id, id));

      return ctx.json({ data });
    } catch (error: any) {}
  });

export default app;
