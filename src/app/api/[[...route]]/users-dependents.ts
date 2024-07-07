// user-dependents.ts
import { db } from "@/db";
import { users, usersDependents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().get("/:userId", async (ctx) => {
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
});

export default app;
