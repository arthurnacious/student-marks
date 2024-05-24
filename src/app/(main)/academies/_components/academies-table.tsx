import React from "react";
import { DataTable } from "@/components/data-table";
import { Academies, columns } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddAcademModal from "./crud/add-academy";
interface Props {}

const AcademiesTable: React.FC<Props> = ({}) => {
  interface Academies {
    id: string;
    name: string;
    courses: number;
    assignees: number;
  }

  const data: Academies[] = [
    {
      id: "728ed52f",
      name: "Art Academy",
      courses: 16,
      assignees: 4,
    },
    {
      id: "b742d9a0",
      name: "Science Academy",
      courses: 20,
      assignees: 5,
    },
    {
      id: "c91d28e4",
      name: "Music Academy",
      courses: 10,
      assignees: 3,
    },
    {
      id: "d621f7b1",
      name: "Technology Academy",
      courses: 25,
      assignees: 6,
    },
    {
      id: "e738f1d5",
      name: "Language Academy",
      courses: 18,
      assignees: 4,
    },
    {
      id: "f58d9c83",
      name: "Sports Academy",
      courses: 12,
      assignees: 3,
    },
    {
      id: "a57e29b3",
      name: "Business Academy",
      courses: 22,
      assignees: 5,
    },
    {
      id: "b28cfa45",
      name: "Culinary Academy",
      courses: 15,
      assignees: 4,
    },
    {
      id: "c53f96a7",
      name: "Literature Academy",
      courses: 17,
      assignees: 4,
    },
    {
      id: "d47e5a09",
      name: "Film Academy",
      courses: 14,
      assignees: 3,
    },
    {
      id: "e64d83f3",
      name: "Fashion Academy",
      courses: 19,
      assignees: 5,
    },
    {
      id: "f74a2b19",
      name: "Engineering Academy",
      courses: 21,
      assignees: 6,
    },
    {
      id: "g67d59c2",
      name: "Architecture Academy",
      courses: 13,
      assignees: 3,
    },
    {
      id: "h45e6b31",
      name: "Photography Academy",
      courses: 16,
      assignees: 4,
    },
    {
      id: "i32f5a8d",
      name: "Performing Arts Academy",
      courses: 20,
      assignees: 5,
    },
    {
      id: "j78e4c21",
      name: "Medical Academy",
      courses: 24,
      assignees: 6,
    },
    {
      id: "k91f7d5b",
      name: "Astronomy Academy",
      courses: 18,
      assignees: 4,
    },
    {
      id: "l23d6e4a",
      name: "Philosophy Academy",
      courses: 15,
      assignees: 4,
    },
    {
      id: "m57a9b6c",
      name: "Graphic Design Academy",
      courses: 17,
      assignees: 4,
    },
    {
      id: "n64e7d8a",
      name: "Environmental Science Academy",
      courses: 22,
      assignees: 5,
    },
  ];

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <AddAcademModal />
        </CardHeader>
        <DataTable columns={columns} data={data} searchCol="name" />
      </CardContent>
    </Card>
  );
};

export default AcademiesTable;
