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
import { useSearchUsers } from "@/query/users";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useGetClasseBySlug } from "@/query/classes";
import { TheClass } from "./index";

interface Props {
  theClass: TheClass;
}

const postType = client.api["class-students"][":id"].students.add.$post;
type ResponseType = InferResponseType<typeof postType>;
type RequestType = InferRequestType<typeof postType>["json"];

const formSchema = z.object({
  student: z.string(),
});

type formValues = z.input<typeof formSchema>;

const AddStudentsModal: React.FC<Props> = ({ theClass }) => {
  const [keyword, setKeyword] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student: "",
    },
  });

  const { data: classData, isLoading: loadingClass } = useGetClasseBySlug(
    theClass.slug,
    theClass
  );

  const { data: students, isLoading: loadingStudents } = useSearchUsers({
    keyword,
  }); //anuone can be a student so not adding RoleName.STUDENT is okay here

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values): Promise<ResponseType> => {
      const response = await postType({
        param: { id: theClass.id },
        json: values,
      });

      if (response.status === 422) {
        throw new Error({
          title: "student is already enrolled",
          statusCode: 422,
        });
      }
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast.success("Student enrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes", theClass.id] });
    },
    onError: (error: any) => {
      toast.error("failed to enroll student");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate({ studentId: values.student });
  }

  function onOpenChange(b: boolean) {
    form.reset();
    setIsOpen(b);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Enroll a student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll a student</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormItem>
                <FormLabel>Search</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Search for a student to enroll
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="student"
                render={({ field }) => (
                  <FormItem className="my-5">
                    <FormLabel>Course</FormLabel>
                    {keyword.length < 2 ? (
                      <div className="rounded-md bg-neutral-500 h-10 w-full flex items-center justify-center text-slate-200">
                        Search for student
                      </div>
                    ) : loadingStudents ? (
                      <Skeleton className="h-10 w-full flex items-center justify-center text-black">
                        <Loader2 className="size-4 mr-2 animate-spin " />
                        <span>Loading Students</span>
                      </Skeleton>
                    ) : students && students.length === 0 ? (
                      <div className="rounded-md bg-neutral-500 h-10 w-full flex items-center justify-center text-slate-200">
                        No students found for &quot;{keyword}&quot;.{" "}
                        <small className="ml-2">
                          Please refine your search...
                        </small>
                      </div>
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students?.map((student) => {
                            const isDisabled =
                              classData &&
                              classData.students?.length > 0 &&
                              classData.students.some(
                                (s) => s.studentId === student.id
                              );
                            return (
                              <SelectItem
                                key={student.id}
                                value={student.id}
                                disabled={isDisabled}
                              >
                                {student.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                    <FormDescription>
                      Select a student to enroll
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={mutation.isPending}>Enroll</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentsModal;
