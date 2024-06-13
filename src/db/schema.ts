import {
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  mysqlEnum,
  index,
  boolean,
} from "drizzle-orm/mysql-core";
import type { AdapterAccount } from "next-auth/adapters";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { RoleName } from "@/types/roles";
import { AttendanceName } from "@/types/attendance";
import { createInsertSchema } from "drizzle-zod";
import { dbCredentials } from "./credentials";
import { relations } from "drizzle-orm";
import { StatusName } from "@/types/course";
import { paymentTypeName } from "@/types/payment";

const poolConnection = mysql.createPool(dbCredentials);

export const db = drizzle(poolConnection);

const roles: string[] = Object.values(RoleName);

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  image: varchar("image", { length: 255 }),
  role: mysqlEnum("role", roles as [string, ...string[]])
    .default(RoleName.STUDENT)
    .notNull(),
  isGardian: boolean("isGardian").default(false),
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

const courseStatusType: string[] = Object.values(StatusName);
export const courses = mysqlTable(
  "courses",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    academyId: varchar("academyId", { length: 255 }).references(
      () => academies.id,
      { onDelete: "set null" }
    ),
    name: varchar("name", { length: 255 }).unique().notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    description: varchar("description", { length: 255 }),
    status: mysqlEnum(
      "status",
      courseStatusType as [string, ...string[]]
    ).default(StatusName.ACTIVE),
    price: int("price").notNull().default(0),
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

export const materials = mysqlTable("materials", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: varchar("courseId", { length: 255 })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  price: varchar("price", { length: 255 }).notNull(),
  amount: int("amount").notNull(),
});

export const materialsClassStudent = mysqlTable("materialClassStudent", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  materialId: varchar("materialId", { length: 255 })
    .notNull()
    .references(() => materials.id, { onDelete: "cascade" }),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  studentId: varchar("studentId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const fields = mysqlTable("fields", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: varchar("courseId", { length: 255 }).references(() => courses.id, {
    onDelete: "set null",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  total: int("total").notNull(),
});

// export const usersToField = mysqlTable("usersToField", {
//   id: varchar("id", { length: 255 })
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   fieldId: varchar("fieldId", { length: 255 }).references(() => fields.id, {
//     onDelete: "cascade",
//   }),
//   userId: varchar("userId", { length: 255 }).references(() => users.id, {
//     onDelete: "cascade",
//   }),
// });

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
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    notes: varchar("notes", { length: 255 }),
    price: int("price").notNull().default(0), //make a carbon copy from course as course price can always be changed
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
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  studentId: varchar("studentId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
});

const paymentType: string[] = Object.values(paymentTypeName);
export const payments = mysqlTable("payments", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  amount: int("amount").notNull(),
  type: mysqlEnum("type", paymentType as [string, ...string[]])
    .default(paymentTypeName.CASH)
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const academyHeadsToAcademies = mysqlTable("academyHeadsToAcademies", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  academyId: varchar("academyId", { length: 255 })
    .notNull()
    .references(() => academies.id, { onDelete: "cascade" }),
  academyHeadId: varchar("academyHeadId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const lecturersToAcademies = mysqlTable("lecturersToAcademies", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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

//relationships
export const usersRelations = relations(users, ({ many }) => ({
  academiesLecturing: many(academyHeadsToAcademies, {
    relationName: "academiesLecturing",
  }),
  academiesLeading: many(lecturersToAcademies, {
    relationName: "academiesLeading",
  }),
  classes: many(studentsToClasses, {
    relationName: "attendedClasses",
  }),
  mark: many(marks, {
    relationName: "usersMark",
  }),
  presentedClasses: many(classes, {
    relationName: "usersPresentedClasses",
  }),
  materials: many(materialsClassStudent),
  payments: many(payments),
}));

export const studentsToClassesRelations = relations(
  studentsToClasses,
  ({ one, many }) => ({
    student: one(users, {
      fields: [studentsToClasses.studentId],
      references: [users.id],
      relationName: "attendedClasses",
    }),
    class: one(classes, {
      fields: [studentsToClasses.classId],
      references: [classes.id],
      relationName: "class",
    }),
  })
);

export const marksRelations = relations(marks, ({ one }) => ({
  field: one(fields, {
    fields: [marks.fieldId],
    references: [fields.id],
  }),
  student: one(users, {
    fields: [marks.fieldId],
    references: [users.id],
    relationName: "usersMark",
  }),
}));

export const academiesRelations = relations(academies, ({ many }) => ({
  courses: many(courses),
  lecturers: many(lecturersToAcademies),
  heads: many(academyHeadsToAcademies),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  academy: one(academies, {
    fields: [courses.academyId],
    references: [academies.id],
  }),
  fields: many(fields),
  classes: many(classes, {
    relationName: "courseClasses",
  }),
  materials: many(materials),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  course: one(courses, {
    fields: [classes.courseId],
    references: [courses.id],
    relationName: "courseClasses",
  }),
  lecturer: one(users, {
    fields: [classes.creatorId],
    references: [users.id],
    relationName: "usersPresentedClasses",
  }),
  heads: many(studentsToClasses),
  payments: many(payments),
  materials: many(materialsClassStudent),
}));

export const materialRelations = relations(materials, ({ one, many }) => ({
  class: one(courses, {
    fields: [materials.courseId],
    references: [courses.id],
  }),
  classes: many(materialsClassStudent),
}));

export const materialsClassStudentRelations = relations(
  materialsClassStudent,
  ({ one }) => ({
    material: one(materials, {
      fields: [materialsClassStudent.materialId],
      references: [materials.id],
    }),
    class: one(classes, {
      fields: [materialsClassStudent.classId],
      references: [classes.id],
    }),
    student: one(users, {
      fields: [materialsClassStudent.studentId],
      references: [users.id],
    }),
  })
);

export const paymentRelations = relations(payments, ({ one, many }) => ({
  class: one(classes, {
    fields: [payments.classId],
    references: [classes.id],
  }),
  student: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  course: one(courses, {
    fields: [fields.courseId],
    references: [courses.id],
  }),
  marks: many(marks),
}));

export const lecturerToAcademiesRelations = relations(
  lecturersToAcademies,
  ({ one }) => ({
    academy: one(academies, {
      fields: [lecturersToAcademies.academyId],
      references: [academies.id],
    }),
    lecturer: one(users, {
      fields: [lecturersToAcademies.lecturerId],
      references: [users.id],
      relationName: "academiesLeading",
    }),
  })
);

export const academyHeadsToAcademiesRelations = relations(
  academyHeadsToAcademies,
  ({ one }) => ({
    academy: one(academies, {
      fields: [academyHeadsToAcademies.academyId],
      references: [academies.id],
      relationName: "academiesLecturing",
    }),
    head: one(users, {
      fields: [academyHeadsToAcademies.academyHeadId],
      references: [users.id],
      relationName: "academiesLeading",
    }),
  })
);

export const insertAcademySchema = createInsertSchema(academies);
export const insertCourseSchema = createInsertSchema(academies);
export const insertFieldSchema = createInsertSchema(fields);
export const insertClassesSchema = createInsertSchema(classes);
export const insertUserSchema = createInsertSchema(users);
