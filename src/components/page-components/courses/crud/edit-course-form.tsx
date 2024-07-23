"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { client } from "@/lib/hono";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Error from "next/error";
import type { courseWithRelations } from "@/types/fetch";
import { notFound } from "next/navigation";
import { useGetDepartments } from "@/query/departments";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { InferRequestType, InferResponseType } from "hono";

const UpdateCourseUrl = client.api.courses[":slug"].$patch;

type RequestType = InferRequestType<typeof UpdateCourseUrl>["json"];
type ResponseType = InferResponseType<typeof UpdateCourseUrl>;

interface courseType extends courseWithRelations {}

interface Props {
  course: courseType;
  setCourseSlug: Dispatch<React.SetStateAction<string | undefined>>;
}

const formSchema = z.object({
  department: z.string().min(2, {
    message: "Department is required.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  price: z.number().min(1, {
    message: "Price must be at least 1 characters long.",
  }),
});

type formValues = z.input<typeof formSchema>;

const EditCourseForm: React.FC<Props> = ({ course, setCourseSlug }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetDepartments();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: course.departmentId ?? "",
      name: course.name ?? "",
      price: course.price / 100 ?? 0,
    },
  });

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await UpdateCourseUrl({
        json: values,
        param: { slug: course.slug ?? "--" },
      });
      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Department updated successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["courses", course?.slug],
      });
      setCourseSlug(undefined);
    },
    onError: (error: any) => {
      if (error.props.statusCode === 422) {
        form.setError("name", { message: "The selected name already exist" });
        return;
      }
      toast.error("failed to update course");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate({
      ...values,
      departmentId: values.department,
    });
  }

  function onOpenChange(b: boolean) {
    form.reset();
  }

  if (!course) {
    return notFound();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                {isLoading ? (
                  <Skeleton className="h-10 w-full flex items-center justify-center text-black">
                    <Loader2 className="size-4 mr-2 animate-spin " />
                    <span>Loading departments</span>
                  </Skeleton>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormDescription>
                  You can manage departments list in your{" "}
                  <Link href="/departments">department settings</Link>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-x-5 mb-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Math 1" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the name of the course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Course Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Math 1"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>Course Price without the R</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button isLoading={mutation.isPending}>Update</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditCourseForm;
