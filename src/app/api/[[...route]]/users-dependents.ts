// user-dependents.ts
import { db } from "@/db";
import {
  insertUsersDependentsSchema,
  users,
  usersDependents,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/:userId", async (ctx) => {
    const guardianId = ctx.req.param("userId");

    const data = await db.query.usersDependents.findMany({
      where: eq(usersDependents.guardianId, guardianId),
      with: {
        dependent: {
          columns: { name: true, email: true, id: true },
        },
      },
    });

    return ctx.json({ data });
  })
  .post(
    "/:userId",
    zValidator("json", insertUsersDependentsSchema.pick({ dependentId: true })),
    async (ctx) => {
      const guardianId = ctx.req.param("userId");
      const { dependentId } = ctx.req.valid("json");

      const [existingRelation] = await db
        .select()
        .from(usersDependents)
        .where(
          and(
            eq(usersDependents.dependentId, dependentId as string),
            eq(usersDependents.guardianId, guardianId)
          )
        );

      if (existingRelation) {
        return ctx.json({ error: "Dependent already set fo this user" }, 422);
      }

      const data = await db.insert(usersDependents).values({
        guardianId,
        dependentId,
      });

      return ctx.json({ data });
    }
  )
  .post(
    "/:userId/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (ctx) => {
      const guardianId = ctx.req.param("userId");
      const { ids } = ctx.req.valid("json");

      try {
        const data = await db
          .delete(usersDependents)
          .where(
            and(
              inArray(usersDependents.id, ids),
              eq(usersDependents.guardianId, guardianId)
            )
          );

        return ctx.json({ data: ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
