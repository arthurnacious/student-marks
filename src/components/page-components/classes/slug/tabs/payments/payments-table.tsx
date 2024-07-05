"use client";
import React, { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TheClass } from "../students";
import { useGetClasseBySlug } from "@/query/classes";
import { Button } from "@/components/ui/button";
import { FaMoneyBill } from "react-icons/fa";
import StudentsPaymentModal from "./students-payment-modal";
import {
  getMaterialSumAmount,
  getOwingAmount,
  getTotalPaymentAmount,
} from "@/lib/payments-functions";
import TableSkeleton from "@/components/skeleton/table";
import { convertToZARCurrency } from "@/lib/utils";

interface Props {
  theClass: TheClass;
}

const PaymentsTable: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);
  const [studentId, setStudentId] = useState<string | undefined>(undefined);

  const studentMaterials = data?.materials;
  const courseMaterials = data?.course.materials;

  const getClassPrice = (): number => {
    return data?.price ?? 0;
  };

  const coursePrice = getClassPrice();

  if (isLoading) return <TableSkeleton cols={4} />;

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <>
      <StudentsPaymentModal
        classId={theClass.id}
        studentId={studentId}
        setStudentId={setStudentId}
        payments={data?.payments}
      />
      <p>
        Class Price is {convertToZARCurrency(coursePrice)} Plus cost(s) of any
        material taken.
      </p>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Total Material Cost</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.students.map(({ student }) => {
            const materialCost = getMaterialSumAmount({
              courseMaterials,
              studentMaterials,
              studentId: student.id,
            });
            const totalAmountPayed = getTotalPaymentAmount(
              student.id,
              data?.payments
            );
            const owingAmount = getOwingAmount(
              totalAmountPayed,
              coursePrice,
              materialCost
            );

            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{convertToZARCurrency(materialCost)}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {convertToZARCurrency(totalAmountPayed)}{" "}
                  {owingAmount > 0 ? (
                    <small
                      className="text-yellow-500 flex items-center"
                      title={`${student.name} has to pay ${convertToZARCurrency(
                        totalAmountPayed
                      )} still`}
                    >
                      {convertToZARCurrency(owingAmount)} Outstanding
                    </small>
                  ) : owingAmount < 0 ? (
                    <small
                      className="text-red-500 flex items-center"
                      title={`${student.name} has to payed more money than class price and material`}
                    >
                      Payed {convertToZARCurrency(Math.abs(owingAmount))} More
                    </small>
                  ) : (
                    <small
                      className="text-green-500 flex items-center"
                      title={`${student.name} has settled the course price`}
                    >
                      <FaMoneyBill className="mr-1" /> Settled
                    </small>
                  )}
                </TableCell>
                <TableCell className="p-0">
                  <Button size="sm" onClick={() => setStudentId(student.id)}>
                    Mark Payment
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default PaymentsTable;
