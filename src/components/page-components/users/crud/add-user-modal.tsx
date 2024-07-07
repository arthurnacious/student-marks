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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import Error from "next/error";
import { InferRequestType, InferResponseType } from "hono";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleName } from "@/types/roles";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Props {}

type ResponseType = InferResponseType<typeof client.api.users.$post>;
type RequestType = InferRequestType<typeof client.api.users.$post>["json"];

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

const AddUserModal: React.FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasActiveUntill, setHasActiveUntill] = useState(false);
  const queryClient = useQueryClient();
  // const { mutate, isPending, isError, error, } = useCreateAcademy();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: RoleName.STUDENT,
      activeTill: new Date(),
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.users.$post({ json: values });

      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("User inserted successfully");
      queryClient.invalidateQueries({ queryKey: ["users", null] });
      //for all the users types
      Object.values(RoleName).forEach((role) => {
        queryClient.invalidateQueries({ queryKey: ["users", role] });
      });
    },
    onError: (error: any) => {
      toast.error("failed to insert user");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate({
      ...values,
      activeTill: hasActiveUntill ? values.activeTill : null,
    });
  }

  function onOpenChange(b: boolean) {
    form.reset();
    setIsOpen(b);
    setHasActiveUntill(false);
  }

  const toDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    const value = new Date(Number(year), Number(month) - 1, Number(day));
    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit duration-300">
        <DialogHeader>
          <DialogTitle>Add a user</DialogTitle>
        </DialogHeader>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={(e) => setHasActiveUntill(e as boolean)}
                  id="till"
                />
                <label
                  htmlFor="till"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  User has an active till date
                </label>
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
              <Button isLoading={mutation.isPending}>Create</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
