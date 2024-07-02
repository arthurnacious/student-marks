"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { client } from "@/lib/hono";
import { useForm } from "react-hook-form";
import React from "react";
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
import MultiSelect from "@/components/ui/multi-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetUsers } from "@/query/users";
import { RoleName } from "@/types/roles";
import { toast } from "sonner";
import Error from "next/error";
import type { academyWithRelations } from "@/types/fetch";
import { notFound, useRouter } from "next/navigation";

const updateAcademyUrl = client.api.academies[":slug"].$patch;
type updateAcademyRequestType = InferRequestType<
  typeof updateAcademyUrl
>["json"];
type updateAcademyResponseType = InferResponseType<typeof updateAcademyUrl>;

interface academiesType extends academyWithRelations {}

interface Props {
  academy: academiesType | undefined;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type formValues = z.input<typeof formSchema>;

const EditAcademyForm: React.FC<Props> = ({ academy }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: academy?.name ?? "",
    },
  });

  const mutation = useMutation<
    updateAcademyResponseType,
    Error,
    updateAcademyRequestType
  >({
    mutationFn: async (values) => {
      const response = await updateAcademyUrl({
        json: values,
        param: { slug: academy?.slug ?? "--" },
      });
      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Academy updated successfully");
      queryClient.invalidateQueries({ queryKey: ["academies"] });
      queryClient.invalidateQueries({
        queryKey: ["academies", "academy?.slug"],
      });
      router.back();
    },
    onError: (error: any) => {
      if (error.props.statusCode === 422) {
        form.setError("name", { message: "The selected name already exist" });
        return;
      }
      toast.error("failed to insert academy");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate(values);
  }

  function onOpenChange(b: boolean) {
    form.reset();
  }

  if (!academy) {
    return notFound();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button isLoading={mutation.isPending}>Update</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditAcademyForm;
