// payments.ts
import { db } from "@/db";
import { insertPaymentSchema, materials, payments } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { never, z } from "zod";

const app = new Hono().post(
  "/:classId/pay",
  zValidator(
    "json",
    insertPaymentSchema.pick({ amount: true, userId: true, type: true })
  ),
  async (ctx) => {
    const values = ctx.req.valid("json");
    const classId = ctx.req.param("classId");

    try {
      const existingPayment = await db.query.payments.findFirst({
        where: and(
          eq(payments.userId, values.userId),
          eq(payments.classId, classId)
        ),
      });

      let data;

      if (existingPayment) {
        data = await db
          .update(payments)
          .set({ amount: values.amount * 100 })
          .where(
            and(
              eq(payments.userId, values.userId),
              eq(payments.classId, classId)
            )
          );
      } else {
        data = await db
          .insert(payments)
          .values({
            ...values,
            amount: values.amount * 100,
            userId: values.userId,
            classId: classId,
          });
      }

      return ctx.json({ data });
    } catch (error: any) {
      console.error("Error processing request:", error);
      return ctx.json({ error: "Internal server error" }, 500);
    }
  }
);

export default app;
