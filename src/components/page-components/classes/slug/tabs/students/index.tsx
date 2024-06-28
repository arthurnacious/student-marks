"use client";
import {
  useBulkDeleteStudentsFromClass,
  useGetClasseBySlug,
} from "@/query/classes";
import AddStudentsModal from "./add-students";
import React, { FC } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import TableSkeleton from "@/components/skeleton/table";
import { Mark } from "@/lib/marks-functions";

export type Attendance = {
  id: string;
  studentId: string;
  classSessionId: string;
  role: string;
};

export type Session = {
  id: string;
  name: string;
  classId: string;
  attendances: Attendance[];
  createdAt: string;
  updatedAt: string | null;
};

export type Field = {
  id: string;
  name: string;
  courseId: string;
  total: number;
  marks: Mark[];
};

export type Material = {
  id: string;
  name: string;
  courseId: string;
  price: number;
  amount: number;
};

export interface TheClass {
  id: string;
  slug: string;
  price: number;
  courseId: string;
  creatorId: string;
  notes: string | null;
  type: string;
  createdAt: string;
  updatedAt: string | null;
  course: {
    id: string;
    name: string;
    slug: string;
    academyId: string | null;
    description: string | null;
    status: string | null;
    price: number;
    createdAt: string;
    updatedAt: string | null;
    fields: Field[];
    materials: Material[];
  };
  materials: {
    id: string;
    materialId: string;
    classId: string;
    price: number;
    studentId: string;
  }[];
  lecturer: {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
    image: string | null;
    role: string;
    isGardian: boolean | null;
    activeTill: string | null;
    createdAt: string;
    updatedAt: string | null;
  };
  payments: {
    id: string;
    userId: string;
    classId: string;
    amount: number;
    type: string;
    createdAt: string;
    updatedAt: string | null;
  }[];
  students: {
    id: string;
    classId: string;
    studentId: string;
    student: {
      id: string;
      name: string;
      email: string;
      emailVerified: string | null;
      image: string | null;
      role: string;
      isGardian: boolean | null;
      activeTill: string | null;
      createdAt: string;
      updatedAt: string | null;
    };
  }[];
  sessions: Session[];
}

interface Props {
  theClass: TheClass;
}

const StudentsTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);
  const removeStudents = useBulkDeleteStudentsFromClass(theClass.id);
  return (
    <>
      <div>
        <AddStudentsModal theClass={theClass} />
      </div>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.students && data.students.length > 0 ? (
        <DataTable
          deleteWording="Remove Student"
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            removeStudents.mutate({ ids });
          }}
          isLoading={removeStudents.isPending || isLoading}
          data={data.students}
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">
            There are no students enrolled for this class.
          </h3>
        </div>
      )}
    </>
  );
};

export default StudentsTab;
