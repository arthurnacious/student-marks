"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourseBySlug } from "@/query/courses";
import EditCourseForm from "./edit-course-form";

interface Props {
  courseSlug: string | undefined;
  setCourseSlug: Dispatch<React.SetStateAction<string | undefined>>;
}

const EditCourseModal: React.FC<Props> = ({
  courseSlug,
  setCourseSlug,
}: Props) => {
  const { data: course, isLoading } = useGetCourseBySlug(courseSlug);

  if (!courseSlug) {
    return null;
  }

  function onOpenChange(b: boolean) {
    if (!b) {
      setCourseSlug(undefined);
      return;
    }
  }

  return (
    <Dialog
      open={courseSlug !== undefined}
      onOpenChange={(b) => onOpenChange(b)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingCourseEditForm />
        ) : !course ? (
          <div>Course not found...</div>
        ) : (
          <EditCourseForm course={course} setCourseSlug={setCourseSlug} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseModal;

const LoadingCourseEditForm = () => {
  return (
    <div className=" min-w-96">
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="gap-2 mb-5">
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};
