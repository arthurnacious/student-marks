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
import { Checkbox } from "@/components/ui/checkbox";
import { useCheckMaterials } from "@/query/class-materials";
import { convertToZARCurrency } from "@/lib/utils";

interface Props {
  theClass: TheClass;
}

const MaterialsTable: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug);

  const { mutate: handleCheckMaterials, isPending } = useCheckMaterials(
    theClass.id
  );

  const materials = data?.course.materials;

  const handleCheckboxChange = (
    v: boolean,
    studentId: string,
    materialId: string
  ) => {
    handleCheckMaterials({ materialId, studentId, taken: v });
  };

  const checkIsChecked = ({
    studentId,
    materialId,
  }: {
    studentId: string;
    materialId: string;
  }): boolean => {
    const material = data?.materials.find(
      (material) =>
        studentId === material.studentId && materialId === material.materialId
    );

    return Boolean(material);
  };

  return (
    <>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : materials && materials.length > 0 ? (
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {materials.map(({ id, name, price }) => (
                <TableHead key={`head:${id}`} className="text-center">
                  {name}{" "}
                  <small className="italic">
                    ({convertToZARCurrency(price)} per item)
                  </small>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.students.map(({ student }) => {
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  {materials.map(({ id, name }) => {
                    const isChecked = checkIsChecked({
                      studentId: student.id,
                      materialId: id,
                    });
                    return (
                      <TableCell
                        key={`stu:${student.id}-cell:${id}`}
                        className="text-center text-nowrap"
                      >
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
        </Table>
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">
            There are no materials for {theClass.course.name}.
          </h3>
        </div>
      )}
    </>
  );
};

export default MaterialsTable;
