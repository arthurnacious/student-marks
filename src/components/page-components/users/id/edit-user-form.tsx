"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { client } from "@/lib/hono";
import { useForm } from "react-hook-form";
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
import { useGetUserById, useGetUsers } from "@/query/users";
import { RoleName } from "@/types/roles";
import { toast } from "sonner";
import Error from "next/error";
import type { departmentWithRelations } from "@/types/fetch";
import { notFound, useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toDate } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const editUserUrl = client.api.users[":id"].$patch;
type RequestType = InferRequestType<typeof editUserUrl>["json"];

interface Props {
  user: {
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
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email("This is not a valid email."),
  role: z.enum(Object.values(RoleName) as [string, ...string[]]),
  activeTill: z.coerce.date().optional(),
});

type formValues = z.input<typeof formSchema>;

const EditUserForm: React.FC<Props> = ({ user }) => {
  const [hasActiveUntill, setHasActiveUntill] = useState(
    user.activeTill ? true : false
  );
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: RoleName[user.role as keyof typeof RoleName] ?? RoleName.STUDENT,
      activeTill: user.activeTill ? new Date(user.activeTill) : new Date(),
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await editUserUrl({
        json: values,
        param: { id: user.id },
      });

      if (response.status === 422) {
        throw new Error({ title: "email is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("user updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", user.id],
      });
      router.back();
    },
    onError: (error: any) => {
      if (error.props.statusCode === 422) {
        form.setError("email", { message: "The selected email already exist" });
        return;
      }
      toast.error("failed to insert department");
    },
  });

  function onSubmit(values: formValues) {
    console.log({ values });
    mutation.mutate({
      ...values,
      activeTill: hasActiveUntill ? values.activeTill : null,
    });
  }

  function onOpenChange(b: boolean) {
    form.reset();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                onCheckedChange={(e) => setHasActiveUntill(e as boolean)}
                defaultChecked={hasActiveUntill}
                id="till"
              />
              <label
                htmlFor="till"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                User has an active till date
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="activeTill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active Untill</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className={cn(
                        hasActiveUntill ? "scale-100" : "scale-0",
                        "duration-300"
                      )}
                      {...field}
                      value={
                        typeof field.value === "string"
                          ? field.value // If it's already a string, keep it as it is
                          : field.value instanceof Date &&
                            !isNaN(field.value.getTime())
                          ? field.value.toISOString().split("T")[0] // Convert Date to string in YYYY-MM-DD format
                          : "" // Otherwise, set it to an empty string
                      }
                      onChange={(e) => {
                        const dateValue = toDate(e.target.value);
                        field.onChange(dateValue); // Pass the Date object
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(RoleName).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button isLoading={mutation.isPending}>Update</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditUserForm;
