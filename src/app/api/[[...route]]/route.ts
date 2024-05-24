// index.ts
import { Hono } from "hono";
import academies from "./academies";
import courses from "./courses";
import users from "./users";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.route("/academies", academies);
app.route("/courses", courses);
app.route("/users", users);

export const GET = handle(app);
export const POST = handle(app);
