"use client";
import {
  useBulkDeleteSTudentsFromClass,
  useGetClasseBySlug,
} from "@/query/classes";
import AddStudentsModal from "./add-students";
import React, { FC } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import TableSkeleton from "@/components/skeleton/table";

export interface TheClass {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  slug: string;
  price: number;
  courseId: string;
  creatorId: string;
  notes: string | null;
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
  };
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
    studentId: string;
    createdAt: string;
    updatedAt: string | null;
    userId: string;
    type: string;
    amount: number;
    classId: string;
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
  sessions: {
    id: string;
    name: string;
    classId: string;
    attendances: {
      id: string;
      studentId: string;
      classSessionId: string;
      role: string;
    }[];
  }[];
}

interface Props {
  theClass: TheClass;
}

const StudentsTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug);
  const removeStudents = useBulkDeleteSTudentsFromClass(theClass.id);
  return (
    <>
      <div>
        <AddStudentsModal theClass={theClass} />
      </div>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data?.data && data.data?.students && data.data.students.length > 0 ? (
        <DataTable
          deleteWording="Remove Student"
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            removeStudents.mutate({ ids });
          }}
          isLoading={removeStudents.isPending || isLoading}
          data={data.data.students}
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
