// index.ts
import { Hono } from "hono";
import academies from "./academies";
import courses from "./courses";
import fields from "./fields";
import classes from "./classes";
import classesSessions from "./class-sessions";
import classStudents from "./class-students";
import materials from "./materials";
import payments from "./payments";
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
  .route("/class-students", classStudents)
  .route("/marks", marks)
  .route("/users", users)
  .route("/materials", materials)
  .route("/payments", payments);

export const GET = handle(route);
export const POST = handle(route);
export const PATCH = handle(route);
export const DELETE = handle(route);

export type AppType = typeof route;
