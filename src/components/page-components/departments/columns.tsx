"use client";
import { ArrowUpDown, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export type Departments = {
  id: string;
  name: string;
  slug: string;
  _count: {
    courses: number;
    lecturers: number;
  };
};

export const columns: ColumnDef<Departments>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    // accessorKey: "_count.courses",
    header: "Courses",
    cell: ({ row }) => {
      const department = row.original;
      return department._count.courses;
    },
  },
  {
    // accessorKey: "_count.lecturers",
    header: "Lecturers",
    cell: ({ row }) => {
      const department = row.original;
      return department._count.lecturers;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const department = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`departments/${department.slug}`}
                className="cursor-pointer"
              >
                View Department
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`departments/${department.slug}/edit`}
                className="cursor-pointer"
              >
                Edit Department
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`departments/${department.slug}/leaders`}
                className="cursor-pointer"
              >
                Manage Department Leaders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`departments/${department.slug}/lecturers`}
                className="cursor-pointer"
              >
                Manage Lecturers
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`departments/${department.slug}/inventory`}
                className="cursor-pointer"
              >
                Manage Inventory
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
