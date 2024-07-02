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
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { RoleName } from "@/types/roles";
import { useGetUsers, useSearchUsers } from "@/query/users";
import Link from "next/link";
import { check } from "drizzle-orm/mysql-core";
import { Input } from "@/components/ui/input";

interface Props {
  academyId: string;
  academiesLecturers: {
    id: string;
    academyId: string;
    lecturerId: string;
    lecturer: {
      id: string;
      name: string;
      email: string;
      emailVerified: string | null;
      image: string | null;
      role: string;
      isGardian: boolean | null;
      activeTill: string | null;
      createdAt: string;
      updatedAt: string | null;
    };
  }[];
}

const postTypeUrl = client.api["academy-lecturers"][":id"].assign.$post;
type ResponseType = InferResponseType<typeof postTypeUrl>;
type RequestType = InferRequestType<typeof postTypeUrl>["json"];

const formSchema = z.object({
  lecturerId: z.string(),
});

type formValues = z.input<typeof formSchema>;

const AddAcademyLecturersModal: React.FC<Props> = ({
  academyId,
  academiesLecturers,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const queryClient = useQueryClient();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lecturerId: "",
    },
  });

  const { data: lecturers, isLoading: loadingLecturers } = useSearchUsers({
    keyword,
    role: RoleName.LECTURER,
  });

  const checkIfUserIsAlreadyAssigned = (userId: string): boolean => {
    const found = academiesLecturers.find(
      (lecturer) => lecturer.lecturerId === userId
    );

    return !!found;
  };

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values): Promise<ResponseType> => {
      const response = await postTypeUrl({
        param: { id: academyId },
        json: values,
      });

      console.log({ response });

      if (response.status === 422) {
        throw new Error({
          title: "user is already assigned",
          statusCode: 422,
        });
      }
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast.success("Lecturer assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["academies"] });
      queryClient.invalidateQueries({ queryKey: ["academies", academyId] });
      queryClient.invalidateQueries({
        queryKey: ["academies", academyId, "lecturers"],
      });
      form.reset();
    },
    onError: (error: any) => {
      toast.error("failed to assign academy lecturer");
      onOpenChange(false);
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
          <PlusCircle className="mr-2" /> Add Academy Lecturer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Academy Lecturer</DialogTitle>
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
                  Search for a lecturer to assign
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="lecturerId"
                render={({ field }) => (
                  <FormItem className="my-5">
                    <FormLabel>Lecturer</FormLabel>
                    {keyword.length < 2 ? (
                      <div className="rounded-md bg-neutral-500 h-10 w-full flex items-center justify-center text-slate-200">
                        Search for Lecturer
                      </div>
                    ) : loadingLecturers ? (
                      <Skeleton className="h-10 w-full flex items-center justify-center text-black">
                        <Loader2 className="size-4 mr-2 animate-spin " />
                        <span>Loading Lecturers</span>
                      </Skeleton>
                    ) : lecturers && lecturers.length === 0 ? (
                      <div className="rounded-md bg-neutral-500 h-10 w-full flex items-center justify-center text-slate-200">
                        No Lecturers found found on the system
                        <small className="ml-2">
                          Manage Lecturers on the{" "}
                          <Link href="/users">users page</Link>
                        </small>
                      </div>
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a User" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lecturers?.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id}
                              disabled={checkIfUserIsAlreadyAssigned(user.id)}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormDescription>
                      Select a user to assign as academy lecturer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={mutation.isPending}>Assign</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAcademyLecturersModal;
