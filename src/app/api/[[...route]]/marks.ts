// users.ts
import { db } from "@/db";
import {
  classes,
  fields,
  marks,
  payments,
  studentsToClasses,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().get("/:userId", async (ctx) => {
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
});

export default app;
