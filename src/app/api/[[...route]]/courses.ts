// courses.ts
import { db } from "@/db";
import { courses } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono()
  .get("/", async (ctx) => {
    const data = await db
      .select({
        id: courses.id,
        name: courses.name,
        slug: courses.slug,
      })
      .from(courses);
    return ctx.json({ data });
  })
  .post("/", (c) => c.json("create a course", 201))
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app;
