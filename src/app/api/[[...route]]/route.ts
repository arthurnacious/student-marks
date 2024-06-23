// index.ts
import { Hono } from "hono";
import academies from "./academies";
import courses from "./courses";
import fields from "./fields";
import classes from "./classes";
import classesSessions from "./class-sessions";
import materials from "./materials";
import marks from "./marks";
import users from "./users";
import { handle } from "hono/vercel";
// import { authMiddleware } from "./middleware";

// export const runtime = "edge";

const route = new Hono()
  .basePath("/api")
  // .use(authMiddleware)
  .route("/academies", academies)
  .route("/courses", courses)
  .route("/fields", fields)
  .route("/classes", classes)
  .route("/class-sessions", classesSessions)
  .route("/marks", marks)
  .route("/users", users)
  .route("/materials", materials);

export const GET = handle(route);
export const POST = handle(route);
export const PATCH = handle(route);
export const DELETE = handle(route);

export type AppType = typeof route;
