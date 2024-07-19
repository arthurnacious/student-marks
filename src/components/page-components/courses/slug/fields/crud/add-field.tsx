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
import React, { useState } from "react";
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
import { ErrorResponseData, ValidationError } from "@/errors/validation";

interface Props {
  courseName: string;
  courseSlug: string;
}

type ResponseType = InferResponseType<typeof client.api.courses.$post>;
const postMethod = client.api.courses[":slug"].fields.$post;
type RequestType = InferRequestType<typeof postMethod>["json"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters long",
  }),
  total: z.number().min(1, {
    message: "The total must be at least 1 characters long",
  }),
});

type formValues = z.input<typeof formSchema>;

const AddFieldModal: React.FC<Props> = ({ courseName, courseSlug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      total: 100,
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.courses[":slug"].fields.$post({
        json: values,
        param: { slug: courseSlug },
      });

      if (response.status === 422) {
        const responseData: ErrorResponseData =
          (await response.json()) as ErrorResponseData;
        throw new ValidationError(422, "Validation Error", responseData.errors);
      }

      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("field added successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["courses", courseSlug, "fields"],
      });
    },
    onError: (error) => {
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
      toast.error("Failed to add field");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate(values);
  }

  function onOpenChange(b: boolean) {
    form.reset();
    setIsOpen(b);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Add Field
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Field for {courseName}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Theory" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="total"
                  render={({ field }) => {
                    field.value = field.value === undefined ? 100 : field.value;
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>Total Mark</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          This is the total mark of the field
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Button isLoading={mutation.isPending}>Create</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldModal;
