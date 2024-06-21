"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useBulkDeleteCourses, useGetCourseMaterials } from "@/query/courses";
import TableSkeleton from "@/components/skeleton/table";
import AddMaterialModal from "./crud/add-material";
interface Props {
  initialData?: any;
  course: { name: string; slug: string; id: string };
}

const CourseMaterialsTable: React.FC<Props> = ({ initialData, course }) => {
  const { data, isLoading } = useGetCourseMaterials(course.slug);
  const deleteCourses = useBulkDeleteCourses();

  return (
    <div>
      <AddMaterialModal courseName={course.name} courseSlug={course.slug} />
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            deleteCourses.mutate({ ids });
          }}
          isLoading={deleteCourses.isPending}
          data={data}
          searchCol="name"
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no materials for this course.</h3>
        </div>
      )}
    </div>
  );
};

export default CourseMaterialsTable;
