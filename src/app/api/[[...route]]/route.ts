// index.ts
import { Hono } from "hono";
import academies from "./academies";
import courses from "./courses";
import users from "./users";
import { handle } from "hono/vercel";

// export const runtime = "edge";

const route = new Hono()
  .basePath("/api")
  .route("/academies", academies)
  .route("/courses", courses)
  .route("/users", users);

export const GET = handle(route);
export const POST = handle(route);

export type AppType = typeof route;
