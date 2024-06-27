"use client";
import { ArrowUpDown, MoreVertical } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type Classes = {
  id: string;
  slug: string;
  students: number;
  sessions: number;
  price: number;
  course: {
    name: string;
  };
  lecturer: {
    name: string;
  };
};

export const columns: ColumnDef<Classes>[] = [
  {
    id: "Select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "course.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Lecturer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lecturer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const course = row.original;
      return course.lecturer.name;
    },
  },
  {
    // accessorKey: "students",
    header: "Students",
    cell: ({ row }) => {
      const roster = row.original;
      return roster.students;
    },
  },
  {
    // accessorKey: "sessions",
    header: "Periods",
    cell: ({ row }) => {
      const roster = row.original;
      return roster.sessions;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const roster = row.original;

      return (
        <Link
          href={`classes/${roster.slug}`}
          className={buttonVariants({ className: "cursor-pointer" })}
        >
          Go to class
        </Link>
      );
    },
  },
];
