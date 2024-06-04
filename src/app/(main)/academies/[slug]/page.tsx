import PageContainerWrapper from "@/components/page-container-wrapper";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { client } from "@/lib/hono";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { FaChalkboard, FaChalkboardTeacher, FaCrown } from "react-icons/fa";
import CountUpCard from "@/components/count-up-card";
import { notFound } from "next/navigation";
import { courses } from "@/db/schema";
import LecturersTable from "./_components/lecturers-table";
import CoursesTable from "./_components/courses-table";

interface Props {
  params: { slug: string };
}

const ViewAcademy: React.FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.academies[":slug"].$get({
    param: { slug },
  });
  const { data: academy } = await response.json();

  if (!academy) {
    return notFound();
  }

  const fetchAcademyCourses = async (id: string) => {
    const response = await client.api.academies[":id"].courses.$get({
      param: { id },
    });

    const { data: academyCourses } = await response.json();
    return academyCourses;
  };

  const fetchAcademyHeads = async (id: string) => {
    const response = await client.api.academies[":id"]["academy-heads"].$get({
      param: { id },
    });

    const { data: academyHeads } = await response.json();
    return academyHeads;
  };

  const fetchAcademyLecturers = async (id: string) => {
    const response = await client.api.academies[":id"].lecturers.$get({
      param: { id },
    });

    const { data: academyLecturers } = await response.json();
    return academyLecturers;
  };

  const [academyCourses, academyHeads, academyLecturers] = await Promise.all([
    fetchAcademyCourses(academy.id),
    fetchAcademyHeads(academy.id),
    fetchAcademyLecturers(academy.id),
  ]);

  const countUpCards = [
    {
      title: "Courses",
      icon: <FaChalkboard className="h-4 w-4 text-muted-foreground" />,
      count: academyCourses.length,
    },
    {
      title: "Academy Heads",
      icon: <FaCrown className="h-4 w-4 text-muted-foreground" />,
      count: academyHeads.length,
    },
    {
      title: "Lecturers",
      icon: <FaChalkboardTeacher className="h-4 w-4 text-muted-foreground" />,
      count: academyLecturers.length,
    },
  ];

  return (
    <PageContainerWrapper
      title={`${academy?.name} Academy Overview`}
      trail={
        <Link
          href="/academies"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
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

        <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8 mt-10">
          <TabsContent value="courses">
            <Card x-chunk="dashboard-06-chunk-0">
              <h2 className="text-2xl py-5 uppercase text-center">Courses</h2>
              <CoursesTable courses={academyCourses} academy={academy} />
            </Card>
          </TabsContent>

          <TabsContent value="academyHeads">
            <Card x-chunk="dashboard-06-chunk-0">
              <h2 className="text-2xl py-5 uppercase text-center">
                Academy Heads
              </h2>
            </Card>
          </TabsContent>

          <TabsContent value="lecturers">
            <Card x-chunk="dashboard-06-chunk-0">
              <h2 className="text-2xl py-5 uppercase text-center">
                {academy.name} Academy Lecturers
              </h2>
              <div>
                <LecturersTable
                  lecturers={academyLecturers}
                  academy={academy}
                />
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </PageContainerWrapper>
  );
};

export default ViewAcademy;

//  <div className="border rounded-lg w-full mb-10">
//           <div className="relative w-full overflow-auto p-5">
//             <h2 className="text-2xl mb-2 uppercase text-center">
//               Academy Heads
//             </h2>
//             <div className="flex flex-wrap justify-center gap-5">
//               {lecturers.map((user) => (
//                 <Card key={user.image} className="w-96">
//                   <CardHeader>
//                     <CardTitle>{user.name}</CardTitle>
//                     <CardDescription>{user.image}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <p>Born: {user.birthDate}</p>
//                     <p>Classes presented: {user.classes}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="border rounded-lg w-full mb-10">
//           <div className="relative w-full overflow-auto p-5">
//             <h2 className="text-2xl mb-2 uppercase text-center">Lecturers</h2>
//             <div className="flex flex-wrap justify-center gap-5">
//               {lecturers.map((user) => (
//                 <Card key={user.image} className="w-96">
//                   <CardHeader>
//                     <CardTitle>{user.name}</CardTitle>
//                     <CardDescription>{user.image}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <p>Born: {user.birthDate}</p>
//                     <p>Classes presented: {user.classes}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="border rounded-lg w-full">
//           <div className="relative w-full overflow-auto p-5">
//             <h2 className="text-2xl mb-2 uppercase ">Courses</h2>

//             <Table>
//               <TableCaption>A list of your recent invoices.</TableCaption>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="max-w-sm truncate">Name</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Classes Ran</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {invoices.map((course) => (
//                   <TableRow key={course.name}>
//                     <TableCell className="font-medium">{course.name}</TableCell>
//                     <TableCell>{course.status}</TableCell>
//                     <TableCell className="text-right">
//                       {course.classes}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//               <TableFooter>
//                 <TableRow>
//                   <TableCell colSpan={2}>Total</TableCell>
//                   <TableCell className="text-right">{99} times</TableCell>
//                 </TableRow>
//               </TableFooter>
//             </Table>
//           </div>
//         </div>
