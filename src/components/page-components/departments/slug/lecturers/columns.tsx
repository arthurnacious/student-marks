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

export type DepartmentsLeaders = {
  id: string;
  departmentId: string;
  lecturerId: string;
  lecturer: {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
    image: string | null;
    role: string;
    activeTill: string | null;
    createdAt: string;
    updatedAt: string | null;
  };
};

export const columns: ColumnDef<DepartmentsLeaders>[] = [
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
    cell: ({
      row: {
        original: { lecturer },
      },
    }) => {
      return lecturer.name;
    },
  },
  {
    header: "email",
    cell: ({
      row: {
        original: { lecturer },
      },
    }) => {
      return lecturer.email;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({
      row: {
        original: { lecturer },
      },
    }) => {
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
              <Link href={`users/${lecturer.id}`} className="cursor-pointer">
                View User
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
