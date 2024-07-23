// latests.ts
import { db } from "@/db";
import {
  attendances,
  classes,
  classSessions,
  courses,
  departments,
  studentsToClasses,
  users,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
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
            department: {
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
  })
  .get("/student-classes/:studentId", async (ctx) => {
    const studentId = ctx.req.param("studentId");
    const limit = parseInt(ctx.req.query("limit") ?? "10", 10);
    const data = await db
      .select({
        id: classes.id,
        department: departments.name,
        className: courses.name,
        lecturer: {
          id: users.id,
          name: users.name,
        },
        date: classes.createdAt,
      })
      .from(studentsToClasses)
      .where(eq(studentsToClasses.studentId, studentId))
      .innerJoin(classes, eq(classes.id, studentsToClasses.classId))
      .innerJoin(courses, eq(courses.id, classes.courseId))
      .innerJoin(users, eq(users.id, classes.creatorId))
      .innerJoin(departments, eq(departments.id, courses.departmentId))
      .limit(limit);

    return ctx.json({ data });
  })
  .get("/lecturered-classes/:lecturerId", async (ctx) => {
    const lecturerId = ctx.req.param("lecturerId");
    const limit = parseInt(ctx.req.query("limit") ?? "10", 10);
    const data = await db
      .select({
        id: classes.id,
        department: departments.name,
        className: courses.name,
        lecturer: users.name,
        date: classes.createdAt,
      })
      .from(classes)
      .where(eq(classes.creatorId, lecturerId))
      .innerJoin(courses, eq(courses.id, classes.courseId))
      .innerJoin(users, eq(users.id, classes.creatorId))
      .innerJoin(departments, eq(departments.id, courses.departmentId))
      .limit(limit);

    return ctx.json({ data });
  });

export default app;
