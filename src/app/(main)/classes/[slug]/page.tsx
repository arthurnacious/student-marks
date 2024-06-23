import PageContainerWrapper from "@/components/page-container-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { FC } from "react";
import { client } from "@/lib/hono";
import { notFound } from "next/navigation";
import StudentsTab from "./_components/tabs/students";
import { PiCalendar, PiCheck, PiMoney, PiStudent } from "react-icons/pi";

interface Props {
  params: { slug: string };
}

const PresentClass: FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.classes[":slug"].$get({
    param: { slug },
  });
  const { data: theClass } = await response.json();

  console.log({ theClass });

  if (!theClass) return notFound();

  return (
    <PageContainerWrapper title={`Presenting ${theClass.course.name} Class`}>
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <Tabs defaultValue="students">
          <TabsList className="mb-5">
            <TabsTrigger value="students">
              <PiStudent className="mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <PiCalendar className="mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="marks">
              <PiCheck className="mr-2" />
              Marks
            </TabsTrigger>
            <TabsTrigger value="payments">
              <PiMoney className="mr-2" />
              Payments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="students" className="flex flex-col gap-4">
            <StudentsTab theClass={theClass} />
          </TabsContent>
          <TabsContent value="attendance">
            Attednance Table goes here
          </TabsContent>
          <TabsContent value="marks">Marks Table goes here</TabsContent>
          <TabsContent value="payments">FInanes Table goes here.</TabsContent>
        </Tabs>
      </div>
    </PageContainerWrapper>
  );
};

export default PresentClass;
