"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Error from "next/error";
import type { courseWithRelations } from "@/types/fetch";
import { notFound, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type RequestType = {
  name: string;
  total: number;
};

interface courseType extends courseWithRelations {}

interface Props {
  course: courseType;
  disabled?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  total: z.number().min(1, {
    message: "Total is required.",
  }),
});

type formValues = z.input<typeof formSchema>;

const CreateFieldsForm: React.FC<Props> = ({ course, disabled = false }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      total: 100,
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.fields[":courseId"].$post({
        json: values,
        param: { courseId: course.id },
      });
      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Field added successfully");
      queryClient.invalidateQueries({
        queryKey: ["courses", course?.slug],
      });
      router.refresh();
    },
    onError: (error: any) => {
      if (error.props.statusCode === 422) {
        form.setError("name", {
          message: "The name already exist on this course",
        });
        return;
      }
      toast.error("failed to add field");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate(values);
  }

  function onOpenChange(b: boolean) {
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder="Theory" {...field} disabled={disabled} />
              </FormControl>
              <FormDescription className="text-nowrap">
                E.g Theory
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 items-center gap-3">
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50"
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormDescription className="text-nowrap">
                  Total Mark(percentage will be Calculated)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          isLoading={mutation.isPending}
          className="border border-green-400/20 mt-4"
          disabled={disabled}
        >
          Add field
        </Button>
      </form>
    </Form>
  );
};

export default CreateFieldsForm;
