"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { useForm } from "react-hook-form";
import React from "react";
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
import MultiSelect from "@/components/ui/multi-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetUsers } from "@/query/users";
import { RoleName } from "@/types/roles";
import { useGetCourses } from "@/query/courses";
import { toast } from "sonner";
import Error from "next/error";
import { academies, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import type { academyWithCount } from "@/types/fetch";

type RequestType = InferRequestType<typeof client.api.academies.$post>["json"];
type userType = InferSelectModel<typeof users>;
type academy = InferSelectModel<typeof academies>;

interface academiesType extends academyWithCount {}

interface Props {
  academy: academiesType;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  courses: z.array(z.string()),
  academyHeads: z.array(z.string()),
  lecturers: z.array(z.string()),
});

type formValues = z.input<typeof formSchema>;

const EditAcademyForm: React.FC<Props> = ({ academy }) => {
  const queryClient = useQueryClient();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: academy.name,
      academyHeads: academy.academyHeads ?? [],
      lecturers: academy.lecturers ?? [],
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.academies.$post({ json: values });
      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Academy inserted successfully");
      queryClient.invalidateQueries({ queryKey: ["academies"] });
    },
    onError: (error: any) => {
      if (error.props.statusCode === 422) {
        form.setError("name", { message: "The selected name already exist" });
        return;
      }
      toast.error("failed to insert academy");
    },
  });

  const lecturers = useGetUsers(RoleName.LECTURER);
  const academyHeads = useGetUsers(RoleName.ACADEMYHEAD);

  function onSubmit(values: formValues) {
    mutation.mutate(values);
  }

  function onOpenChange(b: boolean) {
    form.reset();
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

          <FormField
            control={form.control}
            name="academyHeads"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academy Heads</FormLabel>
                <FormControl>
                  <MultiSelect
                    {...field}
                    isLoading={academyHeads.isLoading}
                    options={academyHeads.data?.map(({ id, name }) => ({
                      value: id,
                      label: name,
                    }))}
                  />
                </FormControl>
                <FormDescription>
                  These are academy head(s) belonging to this academy
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lecturers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lecturers</FormLabel>
                <FormControl>
                  <MultiSelect
                    {...field}
                    isLoading={lecturers.isLoading}
                    options={lecturers.data?.map(({ id, name }) => ({
                      value: id,
                      label: name,
                    }))}
                  />
                </FormControl>
                <FormDescription>
                  These are lecturers who may present classes or assign marks
                  for course within this academy
                </FormDescription>
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

export default EditAcademyForm;
