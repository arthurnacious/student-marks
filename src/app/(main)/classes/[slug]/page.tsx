import PageContainerWrapper from "@/components/page-container-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { client } from "@/lib/hono";
import { notFound } from "next/navigation";
import { PiCalendar, PiCheck, PiMoney, PiStudent } from "react-icons/pi";
import { MdOutlineStorage } from "react-icons/md";
import StudentsTab from "@/components/page-components/classes/slug/tabs/students";
import AttendanceTab from "@/components/page-components/classes/slug/tabs/attendance";
import MarksTab from "@/components/page-components/classes/slug/tabs/marks";
import PaymentsTab from "@/components/page-components/classes/slug/tabs/payments";
import MaterialsTab from "@/components/page-components/classes/slug/tabs/materials";
import React, { FC } from "react";

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
          </TabsList>
          <TabsContent value="students" className="flex flex-col gap-4">
            <StudentsTab theClass={theClass} />
          </TabsContent>
          <TabsContent value="attendances">
            <AttendanceTab theClass={theClass} />
          </TabsContent>
          <TabsContent value="materials">
            <MaterialsTab theClass={theClass} />
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
