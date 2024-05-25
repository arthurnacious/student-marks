// academies.ts
import { db } from "@/db";
import {
  academies,
  courses,
  insertAcademySchema,
  lecturerToAcademy,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import slugify from "slugify";

const app = new Hono()
  .get("/", async (ctx) => {
    const data = await db
      .select({
        id: academies.id,
        name: academies.name,
        slug: academies.slug,
        _count: {
          courses: sql<number>`count(${courses.academyId})`,
          asignees: sql<number>`count(${lecturerToAcademy.academyId})`,
        },
      })
      .from(academies)
      .leftJoin(courses, eq(academies.id, courses.academyId))
      .leftJoin(
        lecturerToAcademy,
        eq(academies.id, lecturerToAcademy.academyId)
      )
      .groupBy(academies.id)
      .orderBy(academies.name);
    return ctx.json({ data });
  })
  .post(
    "/",
    zValidator("json", insertAcademySchema.pick({ name: true })),
    async (ctx) => {
      const values = ctx.req.valid("json");
      let slug = slugify(values.name);
      let counter = 1;
      let isSlugAvailable = false;

      while (!isSlugAvailable) {
        const [result] = await db
          .select({ name: academies.name })
          .from(academies)
          .where(eq(academies.slug, slug));

        if (result) {
          // Slug already exists, increment the counter and create a new slug
          slug = `${slugify(values.name)}-${counter}`;
          counter++;
        } else {
          // Slug is available
          isSlugAvailable = true;
        }
      }

      const data = await db.insert(academies).values({ slug, ...values });
      return ctx.json({ data });
    }
  )
  .get("/:id", (ctx) => ctx.json(`get ${c.req.param("id")}`));

export default app;
