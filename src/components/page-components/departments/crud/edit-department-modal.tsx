"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { Dispatch } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import Error from "next/error";
import { InferRequestType, InferResponseType } from "hono";
import { useGetDepartmentBySlug } from "@/query/departments";
import EditDepartmentForm from "./edit-department-form";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  departmentSlug: string | undefined;
  setDepartmentSlug: Dispatch<React.SetStateAction<string | undefined>>;
}

type ResponseType = InferResponseType<typeof client.api.departments.$post>;
type RequestType = InferRequestType<
  typeof client.api.departments.$post
>["json"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type formValues = z.input<typeof formSchema>;

const EditDepartmentModal: React.FC<Props> = ({
  departmentSlug,
  setDepartmentSlug,
}: Props) => {
  const { data: department, isLoading } =
    useGetDepartmentBySlug(departmentSlug);

  if (!departmentSlug) {
    return null;
  }

  function onOpenChange(b: boolean) {
    if (!b) {
      setDepartmentSlug(undefined);
      return;
    }
  }

  return (
    <Dialog
      open={departmentSlug !== undefined}
      onOpenChange={(b) => onOpenChange(b)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {department?.name ?? ""} department</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingDepartmentEditForm />
        ) : !department ? (
          <div>Department not found...</div>
        ) : (
          <EditDepartmentForm
            department={department}
            setDepartmentSlug={setDepartmentSlug}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentModal;

function LoadingDepartmentEditForm() {
  return (
    <div className=" min-w-96">
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="gap-2 mb-5">
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="gap-2 mb-5">
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
