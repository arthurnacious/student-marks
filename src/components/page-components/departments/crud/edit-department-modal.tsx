"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch } from "react";
import { useGetDepartmentBySlug } from "@/query/departments";
import EditDepartmentForm from "./edit-department-form";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  departmentSlug: string | undefined;
  setDepartmentSlug: Dispatch<React.SetStateAction<string | undefined>>;
}

const EditDepartmentModal: React.FC<Props> = ({
  departmentSlug,
  setDepartmentSlug,
}: Props) => {
  const { data: department, isLoading } =
    useGetDepartmentBySlug(departmentSlug);

  if (!departmentSlug) {
    return null;
  }

  function onOpenChange(b: boolean) {
    if (!b) {
      setDepartmentSlug(undefined);
      return;
    }
  }

  return (
    <Dialog
      open={departmentSlug !== undefined}
      onOpenChange={(b) => onOpenChange(b)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {department?.name ?? ""} department</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingDepartmentEditForm />
        ) : !department ? (
          <div>Department not found...</div>
        ) : (
          <EditDepartmentForm
            department={department}
            setDepartmentSlug={setDepartmentSlug}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentModal;

const LoadingDepartmentEditForm = () => {
  return (
    <div className=" min-w-96">
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="gap-2 mb-5">
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="gap-2 mb-5">
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};
