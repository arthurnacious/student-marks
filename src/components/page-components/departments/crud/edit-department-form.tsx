"use client";
import React, { Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { client } from "@/lib/hono";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Error from "next/error";
import type { departmentWithRelations } from "@/types/fetch";
import { notFound, useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";

const updateDepartmentUrl = client.api.departments[":slug"].$patch;
type updateDepartmentRequestType = InferRequestType<
  typeof updateDepartmentUrl
>["json"];
type updateDepartmentResponseType = InferResponseType<
  typeof updateDepartmentUrl
>;

interface departmentsType extends departmentWithRelations {}

interface Props {
  department: departmentsType | undefined;
  setDepartmentSlug: Dispatch<React.SetStateAction<string | undefined>>;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type formValues = z.input<typeof formSchema>;

const EditDepartmentForm: React.FC<Props> = ({
  department,
  setDepartmentSlug,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name ?? "",
    },
  });

  const mutation = useMutation<
    updateDepartmentResponseType,
    Error,
    updateDepartmentRequestType
  >({
    mutationFn: async (values) => {
      const response = await updateDepartmentUrl({
        json: values,
        param: { slug: department?.slug ?? "--" },
      });
      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Department updated successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({
        queryKey: ["departments", "department?.slug"],
      });
      setDepartmentSlug(undefined);
    },
    onError: (error: any) => {
      if (error.props.statusCode === 422) {
        form.setError("name", { message: "The selected name already exist" });
        return;
      }
      toast.error("failed to insert department");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate(values);
  }

  function onOpenChange(b: boolean) {
    form.reset();
  }

  if (!department) {
    return notFound();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button isLoading={mutation.isPending}>Update</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditDepartmentForm;
