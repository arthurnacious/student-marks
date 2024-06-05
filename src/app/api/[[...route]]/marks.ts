// users.ts
import { db } from "@/db";
import { fields, marks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().get("/:userId", async (ctx) => {
  const userId = ctx.req.param("userId");
  const data = await db.query.marks.findMany({
    where: eq(marks.studentId, userId),
    columns: {
      id: true,
      amount: true,
    },
    with: {
      field: {
        with: {
          course: {
            columns: { name: true },
          },
        },
      },
    },
  });

  return ctx.json({ data });
});

export default app;
