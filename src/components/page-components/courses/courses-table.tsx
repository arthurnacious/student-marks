"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useBulkDeleteCourses, useGetCourses } from "@/query/courses";
import TableSkeleton from "@/components/skeleton/table";
import AddCourseModal from "./crud/add-course-modal";
import EditCourseModal from "./crud/adit-course-modal";
interface Props {}

const CoursesTable: React.FC<Props> = ({}) => {
  const [courseSlug, setCourseSlug] = useState<string | undefined>(undefined);
  const { data, isLoading } = useGetCourses();
  const deleteCourses = useBulkDeleteCourses();

  return (
    <div>
      <EditCourseModal courseSlug={courseSlug} setCourseSlug={setCourseSlug} />
      <AddCourseModal />
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns({ setCourseSlug: setCourseSlug })}
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
          <h3 className="text-2xl ">There are no courses on the system.</h3>
        </div>
      )}
    </div>
  );
};

export default CoursesTable;
