// users.ts
import { db } from "@/db";
import {
  classes,
  fields,
  marks,
  payments,
  studentsToClasses,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/:userId", async (ctx) => {
    const userId = ctx.req.param("userId");
    const data = await db.query.studentsToClasses.findMany({
      where: eq(studentsToClasses.studentId, userId),
      with: {
        class: {
          with: {
            lecturer: {
              columns: {
                name: true,
              },
            },
            course: {
              columns: {
                name: true,
                price: true,
              },
              with: {
                academy: {
                  columns: {
                    name: true,
                  },
                },
                fields: {
                  columns: {
                    name: true,
                    total: true,
                  },
                  with: {
                    marks: {
                      where: eq(marks.studentId, userId),
                    },
                  },
                  orderBy: [fields.name],
                },
              },
            },
            payments: {
              where: eq(payments.userId, userId),
              columns: {
                amount: true,
                type: true,
              },
            },
          },
        },
      },
    });

    return ctx.json(data);
  })
  .post(
    "/:studentId/set",
    zValidator(
      "json",
      z.object({
        marks: z.record(z.number()),
      })
    ),
    async (ctx) => {
      const studentId = ctx.req.param("studentId");
      console.log({ studentId });
      const { marks: fieldIds } = ctx.req.valid("json");
      try {
        for (const [fieldId, amount] of Object.entries(fieldIds)) {
          console.log({ studentId, fieldId, amount });
          await db.insert(marks).values({ studentId, fieldId, amount });
        }

        return ctx.json({ data: fieldIds });
      } catch (error: any) {
        console.log({ error });
      }
    }
  );

export default app;
