"use client";
import {
  useBulkDeleteSTudentsFromClass,
  useGetClasseBySlug,
} from "@/query/classes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/skeleton/table";
import AddSessionsModal from "./add-session";
import { Checkbox } from "@/components/ui/checkbox";
import { AttendanceName } from "@/types/attendance";
import { check } from "drizzle-orm/mysql-core";
import { useHandleAttendance } from "@/query/class-sessions";
import React, { FC } from "react";
import { TheClass } from "../students";

interface Props {
  theClass: TheClass;
}

const StudentsTable: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug);
  const removeStudents = useBulkDeleteSTudentsFromClass(theClass.id);

  const calculateTotalAttendance = (data: TheClass) => {
    if (!data) return 0;
    const totalSessions = data.sessions.length;
    const totalStudents = data.students.length;
    let attendedSessions = 0;

    data.sessions.forEach((session) => {
      attendedSessions += session.attendances.length;
    });

    const possibleAttendances = totalSessions * totalStudents;
    return ((attendedSessions / possibleAttendances) * 100).toFixed(2);
  };

  const { mutate: handleAttendance } = useHandleAttendance(theClass.id);

  const handleCheckboxChange = (
    v: boolean,
    studentId: string,
    classSessionId: string
  ) => {
    console.log({ v });
    const value = v ? "Present" : "Absent";
    handleAttendance({
      studentId,
      classSessionId,
      role: value,
    });
  };
  return (
    <>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data?.data && data.data?.students && data.data.students.length > 0 ? (
        <Table className="mt-5">
          <TableHeader>
            <TableRow className="bg-neutral-950">
              <TableHead className="text-slate-100">Student</TableHead>
              <TableHead
                colSpan={data?.data?.sessions.length ?? 1}
                className="text-center text-slate-100"
              >
                Sessions
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Name</TableHead>
              {data?.data?.sessions.map(({ id, name }) => (
                <TableHead key={`header-${id}`} className="w-[100px]">
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.students.map(({ student }) => {
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  {data?.data?.sessions.map(({ id }) => {
                    const isChecked =
                      data?.data?.sessions
                        .find((session) => session.id === id)
                        ?.attendances.find(
                          ({ studentId, role }) =>
                            studentId === student.id && role === "Present"
                        ) !== undefined;
                    return (
                      <TableCell key={`cell-${id}`} className="text-center">
                        <Checkbox
                          checked={!!isChecked}
                          onCheckedChange={(value) =>
                            handleCheckboxChange(Boolean(value), student.id, id)
                          }
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={data?.data?.sessions.length ?? 1}
                className="text-nowrap"
              >
                Total Attendance
              </TableCell>
              <TableCell className="text-right">
                {calculateTotalAttendance(data?.data)}%
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no session for this class.</h3>
        </div>
      )}
    </>
  );
};

export default StudentsTable;
