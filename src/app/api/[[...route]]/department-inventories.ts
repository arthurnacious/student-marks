//department-inventories.ts
import { db } from "@/db";
import {
  courses,
  insertLecturersToDepartmentSchema,
  lecturersToDepartments,
  materials,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/:id", async (ctx) => {
    const departmentId = ctx.req.param("id");

    const data = await db
      .select({
        id: materials.id,
        name: sql<string>`concat(${courses.name}, ' ', ${materials.name})`.as(
          "name"
        ),
        departmentId: courses.departmentId,
        price: materials.price,
        amount: materials.amount,
      })
      .from(materials)
      .innerJoin(courses, eq(materials.courseId, courses.id))
      .where(eq(courses.departmentId, departmentId))
      .orderBy(courses.name);

    // const coursesData = await db.query.courses.findMany({
    //   where: eq(courses.departmentId, departmentId),
    //   with: {
    //     materials: true,
    //   },
    // });

    // const filteredData = coursesData.filter(
    //   (course) => course.materials.length > 0
    // );

    // const data = filteredData
    //   .map(({ name: courseName, materials }) => {
    //     const materialsData = materials.map((material) => {
    //       return {
    //         name: `${courseName} ${material.name}`,
    //         price: material.price,
    //         amount: material.amount,
    //       };
    //     });
    //     return materialsData;
    //   })
    //   .flatMap((info) => info);

    return ctx.json({ data });
  })
  .post(
    "/:id/assign",
    zValidator(
      "json",
      insertLecturersToDepartmentSchema.pick({ lecturerId: true })
    ),
    async (ctx) => {
      const departmentId = ctx.req.param("id");
      const { lecturerId } = ctx.req.valid("json");
      console.log({ lecturerId });

      const [existingName] = await db
        .select()
        .from(lecturersToDepartments)
        .where(
          and(
            eq(lecturersToDepartments.lecturerId, lecturerId),
            eq(lecturersToDepartments.departmentId, departmentId)
          )
        );

      if (existingName) {
        return ctx.json({ name: "user Already assigned" }, 422);
      }

      const data = await db.insert(lecturersToDepartments).values({
        lecturerId,
        departmentId,
      });

      return ctx.json({ data });
    }
  )
  .post(
    "/:id/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (ctx) => {
      const { ids } = ctx.req.valid("json");

      try {
        const data = await db
          .delete(materials)
          .where(inArray(materials.id, ids));

        return ctx.json({ data: ids });
      } catch (error: any) {
        console.error("Error processing request:", error);
        return ctx.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
