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
import { useGetUsers } from "@/query/users";
import Link from "next/link";
import { check } from "drizzle-orm/mysql-core";
import { Input } from "@/components/ui/input";

interface Props {
  departmentId: string;
  departmentsLeaders: {
    id: string;
    departmentId: string;
    departmentLeaderId: string;
    leader: {
      id: string;
      name: string;
      email: string;
      emailVerified: string | null;
      image: string | null;
      role: string;
      activeTill: string | null;
      createdAt: string;
      updatedAt: string | null;
    };
  }[];
}

const postTypeUrl = client.api["department-leaders"][":id"].assign.$post;
type ResponseType = InferResponseType<typeof postTypeUrl>;
type RequestType = InferRequestType<typeof postTypeUrl>["json"];

const formSchema = z.object({
  departmentLeaderId: z.string(),
});

type formValues = z.input<typeof formSchema>;

const AddDepartmentLeadersModal: React.FC<Props> = ({
  departmentId,
  departmentsLeaders,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const queryClient = useQueryClient();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentLeaderId: "",
    },
  });

  const { data: departmentLeaders, isLoading: loadingLeaders } = useGetUsers(
    RoleName.DEPARTMENTLEADER
  );

  const checkIfUserIsAlreadyAssigned = (userId: string): boolean => {
    const found = departmentsLeaders.find(
      ({ departmentLeaderId }) => departmentLeaderId === userId
    );

    return !!found;
  };

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values): Promise<ResponseType> => {
      const response = await postTypeUrl({
        param: { id: departmentId },
        json: values,
      });

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
      toast.success("Department leader assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({
        queryKey: ["departments", departmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["departments", departmentId, "leaders"],
      });
      form.reset();
    },
    onError: (error: any) => {
      toast.error("failed to assign department leader");
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
          <PlusCircle className="mr-2" /> Add Department Leader
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Department Leader</DialogTitle>
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
                name="departmentLeaderId"
                render={({ field }) => (
                  <FormItem className="my-5">
                    <FormLabel>Course</FormLabel>
                    {loadingLeaders ? (
                      <Skeleton className="h-10 w-full flex items-center justify-center text-black">
                        <Loader2 className="size-4 mr-2 animate-spin " />
                        <span>Loading department Leaders</span>
                      </Skeleton>
                    ) : departmentLeaders && departmentLeaders.length === 0 ? (
                      <div className="rounded-md bg-neutral-500 h-10 w-full flex items-center justify-center text-slate-200">
                        No department leaders found found on the system
                        <small className="ml-2">
                          Manage department leaders on the{" "}
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
                          {departmentLeaders?.map((user) => (
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
                      Select a user to assign as department head
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

export default AddDepartmentLeadersModal;
