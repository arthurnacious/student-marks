"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PiCalendar,
  PiCheck,
  PiMoney,
  PiNote,
  PiStudent,
} from "react-icons/pi";
import { MdOutlineStorage } from "react-icons/md";
import StudentsTab from "@/components/page-components/classes/slug/tabs/students";
import AttendanceTab from "@/components/page-components/classes/slug/tabs/attendance";
import MarksTab from "@/components/page-components/classes/slug/tabs/marks";
import PaymentsTab from "@/components/page-components/classes/slug/tabs/payments";
import MaterialsTab from "@/components/page-components/classes/slug/tabs/materials";
import React, { FC } from "react";
import { useGetClasseBySlug } from "@/query/classes";
import { notFound } from "next/navigation";
import NotesTab from "./notes";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/skeleton/table";

interface Props {
  slug: string;
}

const ClassTabs: FC<Props> = ({ slug }) => {
  const { data, isLoading } = useGetClasseBySlug(slug);

  if (isLoading)
    return (
      <div>
        <h2 className="text-2xl mb-4 font-SpaceGrotesk uppercase">
          Loading Class
        </h2>
        <div>
          <Skeleton className="h-9 w-[35rem] my-3" />

          <Skeleton className="h-10 w-28 my-5" />
          <TableSkeleton cols={4} searchable={false} />
        </div>
      </div>
    );

  if (!data) {
    return notFound();
  }

  return (
    <>
      <h2 className="text-2xl mb-4 font-SpaceGrotesk uppercase">
        {data.course.name} class
      </h2>
      <Tabs defaultValue="students">
        <TabsList className="mb-5">
          <TabsTrigger value="students">
            <PiStudent className="mr-2" />
            Students
          </TabsTrigger>
          <TabsTrigger value="attendances">
            <PiCalendar className="mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="materials">
            <MdOutlineStorage className="mr-2" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="marks">
            <PiCheck className="mr-2" />
            Marks
          </TabsTrigger>
          <TabsTrigger value="payments">
            <PiMoney className="mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="notes">
            <PiNote className="mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="students" className="flex flex-col gap-4">
          <StudentsTab theClass={data} />
        </TabsContent>
        <TabsContent value="attendances">
          <AttendanceTab theClass={data} />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialsTab theClass={data} />
        </TabsContent>
        <TabsContent value="marks">
          <MarksTab theClass={data} />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsTab theClass={data} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab theClass={data} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ClassTabs;
