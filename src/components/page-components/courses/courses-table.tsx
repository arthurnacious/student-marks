"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { Courses, columns } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { client } from "@/lib/hono";
import { useBulkDeleteCourses, useGetCourses } from "@/query/courses";
import { Loader2 } from "lucide-react";
import TableSkeleton from "@/components/skeleton/table";
import AddCourseModal from "./crud/add-course";
interface Props {}

const CoursesTable: React.FC<Props> = ({}) => {
  const { data, isLoading } = useGetCourses();
  const deleteCourses = useBulkDeleteCourses();

  return (
    <div>
      <AddCourseModal />
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
          <h3 className="text-2xl ">There are no courses on the system.</h3>
        </div>
      )}
    </div>
  );
};

export default CoursesTable;
