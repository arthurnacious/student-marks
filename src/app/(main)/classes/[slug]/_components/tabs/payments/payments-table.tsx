"use client";
import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TheClass } from "../students";
import { useGetClasseBySlug } from "@/query/classes";
import { Button } from "@/components/ui/button";
import { FaMoneyBill } from "react-icons/fa";

interface Props {
  theClass: TheClass;
}

const PaymentsTable: FC<Props> = ({ theClass }) => {
  const { data } = useGetClasseBySlug(theClass.slug, theClass);

  const getClassPrice = (): number => {
    return data?.data?.price ?? 0;
  };

  const getPayment = (studentId: string): number => {
    const payment = data?.data?.payments.find(
      ({ userId }) => studentId === userId
    );

    return payment?.amount ?? 0;
  };

  const getOwedAmount = (paymentAmount: number, classPrice: number): number => {
    const owedAmount = classPrice - paymentAmount;
    return owedAmount;
  };

  const coursePrice = getClassPrice();
  return (
    <>
      <p>Class Price is R {coursePrice} Plus cost(s) of any material taken </p>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead className="text-center">Payment</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.students.map(({ student }) => {
            const paymentAmount = getPayment(student.id);
            const owedAmount = getOwedAmount(paymentAmount, coursePrice);

            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="flex justify-center items-center gap-2">
                  R {paymentAmount}{" "}
                  {owedAmount > 0 ? (
                    <small
                      className="text-yellow-500 flex items-center"
                      title={`${student.name} has to pay ${paymentAmount} still`}
                    >
                      R {owedAmount} Outstanding
                    </small>
                  ) : owedAmount < 0 ? (
                    <small
                      className="text-red-500 flex items-center"
                      title={`${student.name} has to payed more money than class price and material`}
                    >
                      Payed {Math.abs(owedAmount)} More
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
                  <Button size="xs">Mark Payment</Button>
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
