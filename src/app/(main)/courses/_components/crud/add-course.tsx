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

type ResponseType = InferResponseType<typeof client.api.courses.$post>;
type RequestType = InferRequestType<typeof client.api.courses.$post>["json"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  fields: z.array(z.string().nonempty("Field is required")),
});

type formValues = z.input<typeof formSchema>;

const AddCourseModal: React.FC<Props> = ({}) => {
  const [fieldCount, setFieldCount] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  // const { mutate, isPending, isError, error, } = useCreateCourse();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fields: [""],
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.courses.$post({ json: values });

      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Course added successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: any) => {
      if (error.props.statusCode === 422) {
        form.setError("name", { message: "The selected name already exist" });
        return;
      }
      toast.error("failed to add course");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate(values);
  }

  function onOpenChange(b: boolean) {
    form.reset();
    setIsOpen(b);
    setFieldCount(1);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Add Course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Math 1" {...field} />
                    </FormControl>
                    <FormDescription>
                      This wil be the name of the course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h4 className="text-2xl mt-5 mb-3">Fields</h4>

              <Input
                placeholder="1"
                type="number"
                value={fieldCount}
                min={1}
                max={5}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0 && value <= 5) {
                    setFieldCount(value);
                  } else {
                    form.setError("fields", {
                      message:
                        "Fields has to be more than 0 but not more than 5",
                    });
                  }
                }}
              />
              <div className="flex flex-wrap gap-x-3 my-4">
                {[...Array(fieldCount).keys()].map((_, idx) => (
                  <FormField
                    key={idx}
                    control={form.control}
                    name={`fields.${idx}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filed Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Theory" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button isLoading={mutation.isPending}>Create</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseModal;
