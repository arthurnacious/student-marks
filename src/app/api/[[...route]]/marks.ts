// users.ts
import { db } from "@/db";
import { classes, fields, marks, studentsToClasses } from "@/db/schema";
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
        },
      },
    },
  });

  return ctx.json(data);
});

export default app;
