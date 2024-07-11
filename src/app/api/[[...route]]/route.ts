// index.ts
import { Hono } from "hono";
import academies from "./academies";
import academyHeads from "./academy-heads";
import academyLecturer from "./academy-lecturers";
import academyInventories from "./academy-inventories";
import courses from "./courses";
import fields from "./fields";
import classes from "./classes";
import classesSessions from "./class-sessions";
import classStudents from "./class-students";
import classMaterials from "./class-materials";
import classNotes from "./class-notes";
import materials from "./materials";
import payments from "./payments";
import marks from "./marks";
import users from "./users";
import usersDependents from "./users-dependents";
import latest from "./latest";
import graph from "./graph";
import count from "./count";
import { handle } from "hono/vercel";
// import { authMiddleware } from "./middleware";

// export const runtime = "edge";

const route = new Hono()
  .basePath("/api")
  // .use(authMiddleware)
  .route("/academies", academies)
  .route("/academy-heads", academyHeads)
  .route("/academy-lecturers", academyLecturer)
  .route("/academy-inventories", academyInventories)
  .route("/courses", courses)
  .route("/fields", fields)
  .route("/classes", classes)
  .route("/class-sessions", classesSessions)
  .route("/class-students", classStudents)
  .route("/class-materials", classMaterials)
  .route("/class-notes", classNotes)
  .route("/marks", marks)
  .route("/users", users)
  .route("/users-dependents", usersDependents)
  .route("/materials", materials)
  .route("/payments", payments)
  .route("/latest", latest)
  .route("/graph", graph)
  .route("/count", count);

export const GET = handle(route);
export const POST = handle(route);
export const PATCH = handle(route);
export const DELETE = handle(route);

export type AppType = typeof route;
