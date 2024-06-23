import PageContainerWrapper from "@/components/page-container-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { FC } from "react";
import { client } from "@/lib/hono";
import { notFound } from "next/navigation";
import StudentsTab from "./_components/tabs/students";
import { PiCalendar, PiCheck, PiMoney, PiStudent } from "react-icons/pi";
import AttendanceTab from "./_components/tabs/attendance";
import MarksTab from "./_components/tabs/marks";
import PaymentsTab from "./_components/tabs/payments";

interface Props {
  params: { slug: string };
}

const PresentClass: FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.classes[":slug"].$get({
    param: { slug },
  });
  const { data: theClass } = await response.json();
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
            <AttendanceTab theClass={theClass} />
          </TabsContent>
          <TabsContent value="marks">
            <MarksTab theClass={theClass} />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentsTab theClass={theClass} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainerWrapper>
  );
};

export default PresentClass;
