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

interface Props {}

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

const AddDepartmentModal: React.FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  // const { mutate, isPending, isError, error, } = useCreateDepartment();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.departments.$post({ json: values });

      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Department inserted successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
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
    setIsOpen(b);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Add Department
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a department</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Marketing" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be the name of the department
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={mutation.isPending}>Create</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentModal;
