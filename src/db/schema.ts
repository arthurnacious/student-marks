import {
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";
import type { AdapterAccount } from "next-auth/adapters";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { RoleName } from "@/types/roles";
import { AttendanceName } from "@/types/attendance";
import { dbCredentials } from ".";
import { createInsertSchema } from "drizzle-zod";

const poolConnection = mysql.createPool(dbCredentials);

export const db = drizzle(poolConnection);

const roles: string[] = Object.values(RoleName);

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  image: varchar("image", { length: 255 }),
  role: mysqlEnum("role", roles as [string, ...string[]])
    .default("Student")
    .notNull(),
  activeTill: timestamp("activeTill"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accounts = mysqlTable(
  "accounts",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationTokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

///school stuff
export const academies = mysqlTable(
  "academies",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      nameIdx: index("slug_idx").on(table.slug),
    };
  }
);

export const courses = mysqlTable(
  "courses",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    academyId: varchar("academyId", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    description: varchar("description", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      nameIdx: index("slug_idx").on(table.slug),
    };
  }
);

export const fields = mysqlTable("fields", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: varchar("courseId", { length: 255 })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
});

export const coursesToAcademies = mysqlTable("coursesToAcademies", {
  courseId: varchar("courseId", { length: 255 })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  academyId: varchar("academyId", { length: 255 })
    .notNull()
    .references(() => academies.id, { onDelete: "cascade" }),
});

export const classes = mysqlTable(
  "classes",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    courseId: varchar("courseId", { length: 255 })
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    creatorId: varchar("creatorId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    notes: varchar("notes", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      nameIdx: index("slug_idx").on(table.slug),
    };
  }
);

export const studentsToClasses = mysqlTable("studentToClasses", {
  studentId: varchar("studentId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
});

export const academyHeadsToAcademies = mysqlTable("academyHeadsToAcademies", {
  academyId: varchar("academyId", { length: 255 })
    .notNull()
    .references(() => academies.id, { onDelete: "cascade" }),
  academyHeadId: varchar("academyHeadId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const lecturerToAcademy = mysqlTable("lecturerToAcademy", {
  academyId: varchar("academyId", { length: 255 })
    .notNull()
    .references(() => academies.id, { onDelete: "cascade" }),
  lecturerId: varchar("lecturerId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// cant use session here, its already used, period is the closes word to session I could come up with
export const periods = mysqlTable("periods", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
});

const attendanceType: string[] = Object.values(AttendanceName);
export const attendance = mysqlTable("attendances", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  studentId: varchar("studentId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  periodId: varchar("periodId", { length: 255 })
    .notNull()
    .references(() => periods.id, { onDelete: "cascade" }),
  role: mysqlEnum("name", attendanceType as [string, ...string[]])
    .default("Present")
    .notNull(),
});

export const marks = mysqlTable("marks", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fieldId: varchar("fieldId", { length: 255 })
    .notNull()
    .references(() => fields.id, { onDelete: "cascade" }),
  studentId: varchar("studentId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: int("amount").notNull(),
});

export const insertAcademySchema = createInsertSchema(academies);
