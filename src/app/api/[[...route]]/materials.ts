// materials.ts
import { db } from "@/db";
import { insertMaterialSchema, materials } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { never, z } from "zod";

const updateMaterialSchema = insertMaterialSchema.omit({ courseId: true });

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
      const values = ctx.req.valid("json");

      try {
        const data = await db
          .delete(materials)
          .where(inArray(materials.id, values.ids));

        return ctx.json({ data: values.ids });
      } catch (error: any) {
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .get("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    const data = await db.query.materials.findFirst({
      where: eq(materials.id, id),
    });

    return ctx.json({ data });
  })
  .patch(
    "/:id",
    zValidator(
      "json",
      updateMaterialSchema.pick({ name: true, amount: true, price: true })
    ),
    async (ctx) => {
      const id = ctx.req.param("id");
      const values = ctx.req.valid("json");

      const material = await db.query.materials.findFirst({
        where: eq(materials.id, id),
      });

      if (!material) {
        return ctx.json({ error: "Not found" });
      }

      try {
        values.price = values.price * 100;
        const [data] = await db
          .update(materials)
          .set(values)
          .where(eq(materials.id, id));

        return ctx.json({ data });
      } catch (error: any) {
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
