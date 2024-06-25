"use client";
import { useGetClasseBySlug } from "@/query/classes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/skeleton/table";
import React, { FC, useState } from "react";
import { TheClass } from "../students";
import { Button } from "@/components/ui/button";
import MarkStudentModal from "./mark-student-modal";

interface Props {
  theClass: TheClass;
}

const MarksTable: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug);
  const [studentId, setStudentId] = useState<string | undefined>(undefined);

  const fields = data?.data?.course.fields;

  const getStudentMarks = (studentId: string, fieldId: string) => {
    const mark = fields
      ?.find(({ id }) => id === fieldId)
      ?.marks.find((m) => m.studentId === studentId);
    return mark ? mark.amount : 0;
  };

  const getBackgroundColor = (percentage: number) => {
    if (percentage >= 95) {
      return "bg-green-500/30"; // High marks, green background
    } else if (percentage >= 70) {
      return "bg-teal-500/30"; // Medium marks, yellow background
    } else if (percentage >= 60) {
      return "bg-blue-500/30"; // Medium marks, yellow background
    } else if (percentage >= 50) {
      return "bg-yellow-500/30"; // Low marks, red background
    } else {
      return "bg-red-500/30"; // Low marks, red background
    }
  };

  return (
    <>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : fields && fields.length > 0 ? (
        <>
          <MarkStudentModal
            classId={theClass.id}
            studentId={studentId}
            setStudentId={setStudentId}
            fields={fields}
          />
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                {fields.map(({ id, name }) => (
                  <TableHead key={`head:${id}`}>
                    <div className="flex items-center justify-center">
                      {name}
                    </div>
                  </TableHead>
                ))}
                <TableHead>Mark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.students.map(({ student }) => {
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    {fields.map(({ id, total }) => {
                      const marks = getStudentMarks(student.id, id);
                      const percentage = (marks / total) * 100;
                      const backgroundColorClass =
                        getBackgroundColor(percentage);

                      return (
                        <TableCell
                          key={`stu:${student.id}-cell:${id}`}
                          className="py-0 px-1"
                        >
                          <div
                            className={`${backgroundColorClass} rounded-lg flex items-center justify-center text-nowrap px-2 py-1`}
                          >
                            {`${marks} / ${total}`} = {`${percentage}%`}
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="py-0">
                      <Button
                        size="sm"
                        onClick={() => setStudentId(student.id)}
                      >
                        Mark
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">
            There are no makrs field for {theClass.course.name}.
          </h3>
        </div>
      )}
    </>
  );
};

export default MarksTable;
