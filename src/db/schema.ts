import {
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  mysqlEnum,
  index,
  text,
} from "drizzle-orm/mysql-core";
import type { AdapterAccount } from "next-auth/adapters";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { RoleName } from "@/types/roles";
import { AttendanceName } from "@/types/attendance";
import { createInsertSchema } from "drizzle-zod";
import { dbCredentials } from "./credentials";
import { not, relations } from "drizzle-orm";
import { StatusName } from "@/types/course";
import { paymentTypeName } from "@/types/payment";
import { ClassType } from "@/types/class";

const poolConnection = mysql.createPool(dbCredentials);

export const db = drizzle(poolConnection);

const roles: string[] = Object.values(RoleName);
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 })
      .notNull()
      .unique()
      .$defaultFn(() => `${crypto.randomUUID()}@email.com`), //fallback if there is no email provided
    emailVerified: timestamp("emailVerified", {
      mode: "date",
      fsp: 3,
    }),
    image: varchar("image", { length: 255 }),
    role: mysqlEnum("role", roles as [string, ...string[]])
      .default(RoleName.STUDENT)
      .notNull(),
    activeTill: timestamp("activeTill"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
    };
  }
);

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
export const departments = mysqlTable(
  "departments",
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
    departmentId: varchar("departmentId", { length: 255 }).references(
      () => departments.id,
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
  price: int("price").notNull(),
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
  price: int("price").notNull(),
});

export const fields = mysqlTable("fields", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: varchar("courseId", { length: 255 })
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  total: int("total").notNull(),
});

export const usersDependents = mysqlTable("usersDependents", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guardianId: varchar("guardianId", { length: 255 }).references(
    () => users.id,
    {
      onDelete: "cascade",
    }
  ),
  dependentId: varchar("dependentId", { length: 255 }).references(
    () => users.id,
    {
      onDelete: "cascade",
    }
  ),
});

const classTypes: string[] = Object.values(ClassType);
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
    type: mysqlEnum("type", classTypes as [string, ...string[]])
      .default(ClassType.FT)
      .notNull(),
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

export const departmentLeadersToDepartments = mysqlTable(
  "departmentLeadersToDepartments",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    departmentId: varchar("departmentId", { length: 255 })
      .notNull()
      .references(() => departments.id, { onDelete: "cascade" }),
    departmentLeaderId: varchar("departmentLeaderId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  }
);

export const lecturersToDepartments = mysqlTable("lecturersToDepartments", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  departmentId: varchar("departmentId", { length: 255 })
    .notNull()
    .references(() => departments.id, { onDelete: "cascade" }),
  lecturerId: varchar("lecturerId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// cant use session here, its already used, classSession is the closes word to session I could come up with
export const classSessions = mysqlTable("classSessions", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const classNotes = mysqlTable("classNotes", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  classId: varchar("classId", { length: 255 })
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

const attendanceType: string[] = Object.values(AttendanceName);
export const attendances = mysqlTable("attendances", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  studentId: varchar("studentId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  classSessionId: varchar("classSessionId", { length: 255 })
    .notNull()
    .references(() => classSessions.id, { onDelete: "cascade" }),
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
  departmentsLecturing: many(departmentLeadersToDepartments, {
    relationName: "departmentsLecturing",
  }),
  departmentsLeading: many(lecturersToDepartments, {
    relationName: "departmentsLeading",
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
  attendance: many(attendances),
  guardians: many(usersDependents, {
    relationName: "usersGuardians",
  }),
  dependents: many(usersDependents, {
    relationName: "usersDependents",
  }),
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

export const departmentsRelations = relations(departments, ({ many }) => ({
  courses: many(courses),
  lecturers: many(lecturersToDepartments),
  leaders: many(departmentLeadersToDepartments),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  department: one(departments, {
    fields: [courses.departmentId],
    references: [departments.id],
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
  payments: many(payments),
  sessions: many(classSessions),
  students: many(studentsToClasses),
  materials: many(materialsClassStudent),
  notes: many(classNotes),
}));

export const classNotesRelations = relations(classNotes, ({ one }) => ({
  class: one(classes, {
    fields: [classNotes.classId],
    references: [classes.id],
  }),
}));

export const usersDependentsRelations = relations(
  usersDependents,
  ({ one }) => ({
    guardian: one(users, {
      fields: [usersDependents.guardianId],
      references: [users.id],
      relationName: "usersGuardians",
    }),
    dependent: one(users, {
      fields: [usersDependents.dependentId],
      references: [users.id],
      relationName: "usersDependents",
    }),
  })
);

export const classSessionsRelations = relations(
  classSessions,
  ({ many, one }) => ({
    class: one(classes, {
      fields: [classSessions.classId],
      references: [classes.id],
    }),
    attendances: many(attendances),
  })
);

export const attendanceRelations = relations(attendances, ({ one }) => ({
  student: one(users, {
    fields: [attendances.studentId],
    references: [users.id],
  }),
  session: one(classSessions, {
    fields: [attendances.classSessionId],
    references: [classSessions.id],
  }),
}));

export const materialsRelations = relations(materials, ({ one, many }) => ({
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

export const lecturerToDepartmentsRelations = relations(
  lecturersToDepartments,
  ({ one }) => ({
    department: one(departments, {
      fields: [lecturersToDepartments.departmentId],
      references: [departments.id],
    }),
    lecturer: one(users, {
      fields: [lecturersToDepartments.lecturerId],
      references: [users.id],
      relationName: "departmentsLeading",
    }),
  })
);

export const departmentLeadersToDepartmentsRelations = relations(
  departmentLeadersToDepartments,
  ({ one }) => ({
    department: one(departments, {
      fields: [departmentLeadersToDepartments.departmentId],
      references: [departments.id],
      relationName: "departmentsLecturing",
    }),
    leader: one(users, {
      fields: [departmentLeadersToDepartments.departmentLeaderId],
      references: [users.id],
      relationName: "departmentsLeading",
    }),
  })
);

export const insertDepartmentSchema = createInsertSchema(departments);
export const insertDepartmentLeadersToDepartmentSchema = createInsertSchema(
  departmentLeadersToDepartments
);
export const insertLecturersToDepartmentSchema = createInsertSchema(
  lecturersToDepartments
);
export const insertCourseSchema = createInsertSchema(courses);
export const insertFieldSchema = createInsertSchema(fields);
export const insertClassesSchema = createInsertSchema(classes);
export const insertMaterialSchema = createInsertSchema(materials);
export const insertUserSchema = createInsertSchema(users);
export const insertStudentsToClasses = createInsertSchema(studentsToClasses);
export const insertClassSessionSchema = createInsertSchema(classSessions);
export const insertMaterialClassStudentSchema = createInsertSchema(
  materialsClassStudent
);
export const insertAttendanceSchema = createInsertSchema(attendances);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertClassNotesSchema = createInsertSchema(classNotes);
export const insertUsersDependentsSchema = createInsertSchema(usersDependents);
