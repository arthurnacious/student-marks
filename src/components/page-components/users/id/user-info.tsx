"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { client } from "@/lib/hono";
import { Edit, Loader2, SquareCheckBigIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { FC, Fragment } from "react";
import { formatDate } from "date-fns";
import {
  calculateBackgroundColor,
  calculateTotal,
} from "@/lib/marks-functions";
import { cn, convertToZARCurrency } from "@/lib/utils";
import { useGetStudentsMarks } from "@/query/student-marks";
import { useGetUserById } from "@/query/users";

interface Props {
  studentId: string;
}

const UserInfo: FC<Props> = ({ studentId }) => {
  const { data: marks, isLoading: marksIsLoading } =
    useGetStudentsMarks(studentId);
  const { data: user, isLoading: userIsLoading } = useGetUserById(studentId);

  if (marksIsLoading || userIsLoading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-3xl">
          Loading user Info <span className="animate-ping">...</span>
        </p>
        <Loader2 className="size-24 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-teal-950 to-black/50 rounded-lg">
        <div className="flex items-center justify-between bg-[url('/bonus.png')] bg-right rounded-lg p-8 text-center h-full">
          <div className="bg-black/95 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold">{user?.name}</h2>
            <div>
              <h3 className="">{user?.role}</h3>
              <span className="text-xs">{user?.email}</span>
              <div className="mt-2 flex gap-2">
                {user?.role === "Student" && (
                  <Link
                    href={`/users/${studentId}/marks`}
                    className={buttonVariants({ className: "gap-2" })}
                  >
                    <SquareCheckBigIcon className="size-5" /> View Marks Sheet
                  </Link>
                )}
                <Link
                  href={`/users/${studentId}/marks`}
                  className={buttonVariants({
                    className: "gap-2 bg-neutral-400/50",
                  })}
                >
                  <Edit className="size-5" /> Edit Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full  border border-neutral-500/50 bg-neutral-800/20 rounded p-8 mt-5">
        <h2>Enrollment History</h2>
        <p className="text-slate-400 text-xs">
          Check out a list of all courses available to you.
        </p>
        {marks && marks.length > 0 ? (
          <div className="py-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Course</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center ">Payment</div>
                  </TableHead>
                  <TableHead className="text-right">Mark</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marks.map((mark) => {
                  const total = calculateTotal(mark.class.course.fields);
                  return (
                    <TableRow key={mark.id}>
                      <TableCell className="font-medium">
                        <div className="flex gap-1 items-center text-nowrap">
                          <div>{mark.class.course.name}</div>
                          <div className="text-sm text-neutral-500">
                            ({convertToZARCurrency(mark.class.course.price)})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {mark.class.course?.department?.name} Department
                      </TableCell>
                      <TableCell>{mark.class.lecturer.name}</TableCell>
                      <TableCell>
                        {formatDate(mark.class.createdAt, "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>
                        {mark.class.payments[0] ? (
                          <Fragment>
                            {convertToZARCurrency(
                              mark.class.payments[0]?.amount ?? 0
                            )}
                            <span className="text-xs text-slate-500 ml-2">
                              ({mark.class.payments[0].type})
                            </span>
                          </Fragment>
                        ) : (
                          <span className="text-red-500">Outstanding</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-center items-center">
                          {mark.class.course.fields.map((field) => (
                            <div
                              key={field.name}
                              className="flex flex-col gap-2 items-center"
                            >
                              <span className="text-xs">{field.name}</span>
                              <span className="bg-neutral-950 px-2 py-1 rounded-sm text-sm">
                                {field.marks[0].amount} / {field.total}
                              </span>
                            </div>
                          ))}
                          <span
                            className={cn(
                              calculateBackgroundColor(total),
                              "text-xl px-2 py-1 rounded font-bold"
                            )}
                          >
                            Total: {total} %
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-5">
            <h2>There are no classes available this student.</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default UserInfo;
