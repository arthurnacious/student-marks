"use client";
import { useGetClasseBySlug } from "@/query/classes";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useHandleAttendance } from "@/query/class-sessions";
import React, { FC } from "react";
import { TheClass } from "../students";
import AttendanceCounter from "./_components/attendance-counter";

interface Props {
  theClass: TheClass;
}

function checkIsChecked(
  attendances: {
    id: string;
    role: string;
    studentId: string;
  }[],
  student: {
    id: string;
    role: string;
  }
) {
  return (
    attendances.find(
      ({ studentId, role }) => studentId === student.id && role === "Present"
    ) !== undefined
  );
}

const StudentsTable: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug);

  const { mutate: handleAttendance } = useHandleAttendance(theClass.id);

  const handleCheckboxChange = (
    v: boolean,
    studentId: string,
    classSessionId: string
  ) => {
    const value = v ? "Present" : "Absent";
    handleAttendance({
      studentId,
      classSessionId,
      role: value,
    });
  };

  const calculateTotalAttendance = (): number => {
    if (!data?.data) return 0;
    const totalSessions = data.data.sessions.length;
    const totalStudents = data.data.students.length;
    if (totalSessions === 0 || totalStudents === 0) return 100;
    let attendedSessions = 0;

    data.data.sessions.forEach((session) => {
      attendedSessions += session.attendances.filter(
        (attendance) => attendance.role === "Present"
      ).length;
    });

    const possibleAttendances = totalSessions * totalStudents;
    const value = ((attendedSessions / possibleAttendances) * 100).toFixed(2);

    return parseFloat(value);
  };

  return (
    <>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data?.data && data.data?.students && data.data.students.length > 0 ? (
        <>
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
                  <TableHead
                    key={`header-${id}`}
                    className="w-[100px] text-nowrap"
                  >
                    {name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.students.map(({ student }) => {
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    {data?.data?.sessions.map(({ id, attendances }) => {
                      const isChecked = checkIsChecked(attendances, student);
                      return (
                        <TableCell key={`cell-${id}`} className="text-center">
                          <Checkbox
                            checked={!!isChecked}
                            onCheckedChange={(value) =>
                              handleCheckboxChange(
                                Boolean(value),
                                student.id,
                                id
                              )
                            }
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {data.data.sessions.length > 0 || data.data.sessions.length > 0 ? (
            <div className="flex w-full justify-between items-center">
              <AttendanceCounter totalAttendance={calculateTotalAttendance()} />
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no session for this class.</h3>
        </div>
      )}
    </>
  );
};

export default StudentsTable;
