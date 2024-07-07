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
import { useGetUsersDependents, useSearchUsers } from "@/query/users";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useGetClasseBySlug } from "@/query/classes";

interface Props {
  guardianId: string;
}

const postType = client.api["users-dependents"][":userId"].$post;
type ResponseType = InferResponseType<typeof postType>;
type RequestType = InferRequestType<typeof postType>["json"];

const formSchema = z.object({
  dependent: z.string(),
});

type formValues = z.input<typeof formSchema>;

const AddDependentModal: React.FC<Props> = ({ guardianId }) => {
  const { data: dependands } = useGetUsersDependents(guardianId);
  const [keyword, setKeyword] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dependent: "",
    },
  });

  const { data: students, isLoading: loadingStudents } = useSearchUsers({
    keyword,
  });

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values): Promise<ResponseType> => {
      const response = await postType({
        param: { userId: guardianId },
        json: values,
      });

      if (response.status === 422) {
        throw new Error({
          title: "dependent is already assigned",
          statusCode: 422,
        });
      }
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast.success("Student assign successfully");
      queryClient.invalidateQueries({
        queryKey: ["user", guardianId, "dependents"],
      });
    },
    onError: (error: any) => {
      toast.error("failed to assign dependent");
    },
  });

  function onSubmit({ dependent }: formValues) {
    mutation.mutate({
      dependentId: dependent,
    });
  }

  function onOpenChange(b: boolean) {
    form.reset();
    setIsOpen(b);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Assign a dependent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign a dependent</DialogTitle>
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
                  Search for a student to assign
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="dependent"
                render={({ field }) => (
                  <FormItem className="my-5">
                    <FormLabel>Dependant</FormLabel>
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
                              dependands &&
                              dependands?.length > 0 &&
                              dependands.some(
                                (d) => d.dependentId === student.id
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
                      Select a student to assign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={mutation.isPending}>
                Assign as dependent
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDependentModal;
