"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import Error from "next/error";
import { InferRequestType, InferResponseType } from "hono";
import Link from "next/link";
import { useGetDepartments } from "@/query/departments";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {}

const createCourseUrl = client.api.courses.$post;
type ResponseType = InferResponseType<typeof createCourseUrl>;
type RequestType = InferRequestType<typeof createCourseUrl>["json"];

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

const AddCourseModal: React.FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      name: "",
      price: 0,
    },
  });

  const { data, isLoading } = useGetDepartments();

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await createCourseUrl({ json: values });

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
                            <SelectValue placeholder="Select an department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data?.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.id}
                            >
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
                      <FormDescription>
                        Course Price without the R
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
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

export default AddCourseModal;
