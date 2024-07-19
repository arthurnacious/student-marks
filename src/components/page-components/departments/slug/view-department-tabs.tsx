"use client";
import React, { FC } from "react";
import { FaChalkboard, FaChalkboardTeacher, FaCrown } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CountUpCard from "@/components/count-up-card";
import LecturersTable from "@/components/page-components/departments/slug/lecturers-table";
import CoursesTable from "@/components/page-components/departments/slug/courses-table";
import LeadersTable from "@/components/page-components/departments/slug/leaders-table";
import {
  useGetDepartmentsCourses,
  useGetDepartmentsLeaders,
  useGetDepartmentsLecturers,
  useGetDepartmentBySlug,
} from "@/query/departments";
import Link from "next/link";

interface Props {
  slug: string;
}

const ViewDepartmentTabs: FC<Props> = ({ slug }) => {
  const { data: departmentData, isLoading: departmentLoading } =
    useGetDepartmentBySlug(slug);

  const departmentLeaders = useGetDepartmentsLeaders(slug);
  const departmentLecturers = useGetDepartmentsLecturers(slug);
  const departmentCourses = useGetDepartmentsCourses(departmentData?.id);

  console.log({ data: departmentCourses.data });

  const countUpCards = [
    {
      title: "Courses",
      icon: <FaChalkboard className="h-4 w-4 text-muted-foreground" />,
      count: departmentCourses.data?.length ?? 0,
    },
    {
      title: "Department Leaders",
      icon: <FaCrown className="h-4 w-4 text-muted-foreground" />,
      count: departmentLeaders.data?.length ?? 0,
    },
    {
      title: "Lecturers",
      icon: <FaChalkboardTeacher className="h-4 w-4 text-muted-foreground" />,
      count: departmentLecturers.data?.length ?? 0,
    },
  ];

  if (departmentLoading) return <div>Loading... Department</div>;

  return (
    <>
      <h2 className="mb-5 text-4xl">{departmentData?.name} Department</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {countUpCards.map(({ title, icon, count }, idx) => (
          <CountUpCard
            key={idx}
            title={title}
            icon={icon}
            count={count}
            index={idx}
          />
        ))}
      </div>
      <Tabs defaultValue="courses" className="my-5">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="departmentLeaders">
              Department Leaders
            </TabsTrigger>
            <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full h-full border border-neutral-500/50 mt-10 rounded-md">
          <TabsContent value="courses" className="m-0 rounded-none">
            <Card x-chunk="course-department-courses" className="p-5 rounded">
              <h2 className="text-2xl py-5 uppercase">Courses</h2>
              <CoursesTable
                courses={departmentCourses.data}
                department={departmentData}
              />
            </Card>
          </TabsContent>

          <TabsContent value="departmentLeaders" className="m-0 rounded-none">
            <Card x-chunk="course-department-leaders" className="p-5 rounded">
              <h2 className="text-2xl pt-5 uppercase">
                {departmentData?.name ?? ""} Department Leaders
              </h2>
              {departmentData && (
                <Link href={`/departments/${departmentData.slug}/leaders`}>
                  Manage Department Leaders
                </Link>
              )}
              <LeadersTable
                leaders={departmentLeaders.data}
                department={departmentData}
              />
            </Card>
          </TabsContent>

          <TabsContent value="lecturers" className="m-0 rounded-none">
            <Card x-chunk="course-department-lecturers" className="p-5 rounded">
              <h2 className="text-2xl pt-5 uppercase">
                {departmentData?.name ?? ""} Department Lecturers
              </h2>
              {departmentData && (
                <Link href={`/departments/${departmentData.slug}/lecturers`}>
                  Manage Department Lecturers
                </Link>
              )}
              <div>
                <LecturersTable
                  lecturers={departmentLecturers.data}
                  department={departmentData}
                />
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};

export default ViewDepartmentTabs;
