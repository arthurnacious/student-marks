"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { field, useGetCourseFields } from "@/query/courses";
import TableSkeleton from "@/components/skeleton/table";
import { columns } from "./columns";
import AddFieldModal from "./crud/add-field";
import { useBulkDeleteFields } from "@/query/fields";
import { toast } from "sonner";

interface Props {
  initialData?: field[];
  course: { name: string; slug: string; id: string; classCount: number };
}

const CourseFieldsTable: React.FC<Props> = ({ initialData, course }) => {
  const { data, isLoading } = useGetCourseFields(course.slug, initialData);
  const deleteFields = useBulkDeleteFields({
    courseSlug: course.slug,
    classCount: course.classCount,
  });

  return (
    <div>
      {course.classCount === 0 ? (
        <AddFieldModal courseName={course.name} courseSlug={course.slug} />
      ) : (
        <p className="text-sm text-gray-500">
          You cant add/delete fields for a course that has ran
        </p>
      )}
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            if (course.classCount > 0) {
              toast.error("Cannot delete fields for a course that has ran");
              return;
            }
            const ids = rows.map((row) => row.original.id);
            deleteFields.mutate({ ids });
          }}
          isLoading={deleteFields.isPending}
          data={data}
          searchCol="name"
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no fields for this course.</h3>
        </div>
      )}
    </div>
  );
};

export default CourseFieldsTable;
