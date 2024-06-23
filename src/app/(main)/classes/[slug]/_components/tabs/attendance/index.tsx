"use client";
import {
  useBulkDeleteSTudentsFromClass,
  useGetClasseBySlug,
} from "@/query/classes";
import React, { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/skeleton/table";
import AddSessionsModal from "./add-session";
import { Checkbox } from "@/components/ui/checkbox";
import { AttendanceName } from "@/types/attendance";
import { check } from "drizzle-orm/mysql-core";
import { useHandleAttendance } from "@/query/class-sessions";
import StudentsTable from "./students-table";
import { TheClass } from "../students";
import SessionsTable from "./manage-session/table";

interface Props {
  theClass: TheClass;
}

const AttendanceTab: FC<Props> = ({ theClass }) => {
  return (
    <Tabs defaultValue="attendance">
      <TabsList className="mb-5">
        <TabsTrigger value="attendance">Manage Attendance</TabsTrigger>
        <TabsTrigger value="sessions">Manage Sessions</TabsTrigger>
      </TabsList>
      <TabsContent value="attendance" className="flex flex-col gap-4">
        <StudentsTable theClass={theClass} />
      </TabsContent>
      <TabsContent value="sessions">
        <SessionsTable theClass={theClass} />
      </TabsContent>
    </Tabs>
  );
};

export default AttendanceTab;
