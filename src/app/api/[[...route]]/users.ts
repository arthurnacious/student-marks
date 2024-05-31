// users.ts
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
  .get("/:role?", async (ctx) => {
    const role = ctx.req.param("role");
    const data = await db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(role ? eq(users.role, role) : undefined);
    return ctx.json({ data });
  })
  .post("/", (c) => c.json("create an user", 201))
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app;
