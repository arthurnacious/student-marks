"use client";
import React, { FC } from "react";
import { client } from "@/lib/hono";
import { FaChalkboard, FaChalkboardTeacher, FaCrown } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CountUpCard from "@/components/count-up-card";
import LecturersTable from "@/components/page-components/academies/slug/lecturers-table";
import CoursesTable from "@/components/page-components/academies/slug/courses-table";
import HeadsTable from "@/components/page-components/academies/slug/heads-table";
import {
  useGetAcademiesCourses,
  useGetAcademiesHeads,
  useGetAcademiesLecturers,
  useGetAcademyBySlug,
} from "@/query/academies";
import Link from "next/link";

interface Props {
  slug: string;
}

const ViewAcademyTabs: FC<Props> = ({ slug }) => {
  const { data: academyData, isLoading: academyLoading } =
    useGetAcademyBySlug(slug);

  const academyHeads = useGetAcademiesHeads(slug);
  const academyLecturers = useGetAcademiesLecturers(slug);
  const academyCourses = useGetAcademiesCourses(academyData?.id);

  console.log({ data: academyCourses.data });

  const countUpCards = [
    {
      title: "Courses",
      icon: <FaChalkboard className="h-4 w-4 text-muted-foreground" />,
      count: academyCourses.data?.length ?? 0,
    },
    {
      title: "Academy Heads",
      icon: <FaCrown className="h-4 w-4 text-muted-foreground" />,
      count: academyHeads.data?.length ?? 0,
    },
    {
      title: "Lecturers",
      icon: <FaChalkboardTeacher className="h-4 w-4 text-muted-foreground" />,
      count: academyLecturers.data?.length ?? 0,
    },
  ];

  if (academyLoading) return <div>Loading... Academy</div>;

  return (
    <>
      <h2 className="mb-5 text-4xl">{academyData?.name} Academy</h2>
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
            <TabsTrigger value="academyHeads">Academy Heads</TabsTrigger>
            <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full h-full border border-neutral-500/50 mt-10 rounded-md">
          <TabsContent value="courses" className="m-0 rounded-none">
            <Card x-chunk="course-academy-courses" className="p-5 rounded">
              <h2 className="text-2xl py-5 uppercase">Courses</h2>
              <CoursesTable
                courses={academyCourses.data}
                academy={academyData}
              />
            </Card>
          </TabsContent>

          <TabsContent value="academyHeads" className="m-0 rounded-none">
            <Card x-chunk="course-academy-heads" className="p-5 rounded">
              <h2 className="text-2xl pt-5 uppercase">
                {academyData?.name ?? ""} Academy Heads
              </h2>
              {academyData && (
                <Link href={`/academies/${academyData.slug}/heads`}>
                  Manage Academy Heads
                </Link>
              )}
              <HeadsTable heads={academyHeads.data} academy={academyData} />
            </Card>
          </TabsContent>

          <TabsContent value="lecturers" className="m-0 rounded-none">
            <Card x-chunk="course-academy-lecturers" className="p-5 rounded">
              <h2 className="text-2xl pt-5 uppercase">
                {academyData?.name ?? ""} Academy Lecturers
              </h2>
              {academyData && (
                <Link href={`/academies/${academyData.slug}/lecturers`}>
                  Manage Academy Lecturers
                </Link>
              )}
              <div>
                <LecturersTable
                  lecturers={academyLecturers.data}
                  academy={academyData}
                />
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};

export default ViewAcademyTabs;
