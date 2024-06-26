"use client";

import { Button } from "@/components/ui/button";
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
import { ErrorResponseData, ValidationError } from "@/errors/validation";
import { client } from "@/lib/hono";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  courseSlug: string;
  field: { id: string; name: string; total: number };
}

const patchMethod = client.api.fields[":id"].$patch;
type RequestType = InferRequestType<typeof patchMethod>["json"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters long",
  }),
  total: z.number(),
});

type formValues = z.input<typeof formSchema>;

const EditFieldForm: React.FC<Props> = ({ field, courseSlug }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: field?.name ?? "",
      total: field?.total ?? 0,
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await patchMethod({
        json: values,
        param: { id: field.id },
      });

      if (response.status === 422) {
        const responseData: ErrorResponseData =
          (await response.json()) as ErrorResponseData;
        throw new ValidationError(422, "Validation Error", responseData.errors);
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Field updated successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["courses", courseSlug, "fields"],
      });
      router.back();
    },
    onError: (error: any) => {
      if (error instanceof ValidationError) {
        error.errors.forEach((err) => {
          if (err.name) {
            form.setError("name", { message: err.name });
          }
          if (err.error) {
          }
        });
        return;
      }
      toast.error("failed to update material");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Name</FormLabel>
              <FormControl>
                <Input placeholder="Book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Total Mark</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2"
                  {...field}
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormDescription>
                This is the total mark without the % sign
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={mutation.isPending}>Update</Button>
      </form>
    </Form>
  );
};

export default EditFieldForm;
