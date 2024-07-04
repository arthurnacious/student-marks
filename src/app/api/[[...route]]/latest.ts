// latests.ts
import { db } from "@/db";
import {
  attendances,
  classes,
  classSessions,
  studentsToClasses,
} from "@/db/schema";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
  .get("/users", async (ctx) => {
    const limit = parseInt(ctx.req.query("limit") ?? "10", 10);
    const data = await db.query.users.findMany({
      limit,
    });

    return ctx.json({ data });
  })
  .get("/classes", async (ctx) => {
    const limit = parseInt(ctx.req.query("limit") ?? "10", 10);
    const data = await db.query.classes.findMany({
      with: {
        course: {
          with: {
            academy: {
              columns: {
                name: true,
              },
            },
          },
        },
        lecturer: {
          columns: {
            name: true,
          },
        },
      },
      extras: {
        students:
          sql<number>`(select count(*) from ${studentsToClasses} where studentToClasses.classId = ${classes.id})`.as(
            "students"
          ),
        sessions:
          sql<number>`(select count(*) from ${classSessions} where classSessions.classId = ${classes.id})`.as(
            "sessions"
          ),
        attendance: sql<number>`
            (SELECT 
              COUNT(*)
             FROM 
              ${classSessions} 
             INNER JOIN 
              ${attendances} 
             ON 
              classSessions.id = attendances.classSessionId
             WHERE 
              classSessions.classId = ${classes.id}
            )`.as("attendance"),
      },
      limit,
    });

    return ctx.json({ data });
  });

export default app;
