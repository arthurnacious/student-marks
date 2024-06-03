import PageContainerWrapper from "@/components/page-container-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { client } from "@/lib/hono";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Props {
  params: { slug: string };
}

const ViewAcademy: React.FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.academies[":slug"].$get({
    param: { slug },
  });
  const { data: academy } = await response.json();

  const lecturers = [
    {
      name: "Arthurnacious Monethi",
      image: "./user.svg",
      birthDate: "18-07-1991",
      classes: 20,
    },
    {
      name: "Patrick Foster",
      image: "./user.svg",
      birthDate: "12-07-1985",
      classes: 10,
    },
    {
      name: "Jane Doe",
      image: "./user.svg",
      birthDate: "12-07-1981",
      classes: 14,
    },
  ];

  const invoices = [
    {
      name: "Camera Work",
      status: "Active",
      classes: 50,
      paymentMethod: "Credit Card",
    },
    {
      name: "Sound 1",
      status: "Discontinued",
      classes: 1,
      paymentMethod: "PayPal",
    },
    {
      name: "Sound A",
      status: 20,
      classes: 16,
      paymentMethod: "Bank Transfer",
    },
    {
      name: "WHATNOT",
      status: "Active",
      classes: 27,
      paymentMethod: "Credit Card",
    },
    {
      name: "WEB DESIGN",
      status: "Active",
      classes: 43,
      paymentMethod: "PayPal",
    },
    {
      name: "E. Design",
      status: "Active",
      classes: 5,
      paymentMethod: "Bank Transfer",
    },
    {
      name: "VB.NET",
      status: "Active",
      classes: 2,
      paymentMethod: "Credit Card",
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
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <div className="border rounded-lg w-full mb-10">
          <div className="relative w-full overflow-auto p-5">
            <h2 className="text-2xl mb-2 uppercase text-center">
              Academy Heads
            </h2>
            <div className="flex flex-wrap justify-center gap-5">
              {lecturers.map((user) => (
                <Card key={user.image} className="w-96">
                  <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.image}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Born: {user.birthDate}</p>
                    <p>Classes presented: {user.classes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="border rounded-lg w-full mb-10">
          <div className="relative w-full overflow-auto p-5">
            <h2 className="text-2xl mb-2 uppercase text-center">Lecturers</h2>
            <div className="flex flex-wrap justify-center gap-5">
              {lecturers.map((user) => (
                <Card key={user.image} className="w-96">
                  <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.image}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Born: {user.birthDate}</p>
                    <p>Classes presented: {user.classes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-lg w-full">
          <div className="relative w-full overflow-auto p-5">
            <h2 className="text-2xl mb-2 uppercase ">Courses</h2>

            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-sm truncate">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Classes Ran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((course) => (
                  <TableRow key={course.name}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.status}</TableCell>
                    <TableCell className="text-right">
                      {course.classes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">{99} times</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </PageContainerWrapper>
  );
};

export default ViewAcademy;
