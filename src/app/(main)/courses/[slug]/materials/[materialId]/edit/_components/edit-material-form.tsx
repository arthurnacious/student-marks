"use client";

import { Button } from "@/components/ui/button";
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
import { client } from "@/lib/hono";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  courseSlug: string;
  material: { id: string; name: string; price: number; amount: number };
}

const patchMethod = client.api.materials[":id"].$patch;
type RequestType = InferRequestType<typeof patchMethod>["json"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters long",
  }),
  price: z.number(),
  amount: z.number(),
});

type formValues = z.input<typeof formSchema>;

const EditmaterialForm: React.FC<Props> = ({ material, courseSlug }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: material?.name ?? "",
      price: material?.price / 100 ?? 0,
      amount: material?.amount ?? 0,
    },
  });

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await patchMethod({
        json: values,
        param: { id: material.id },
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Material updated successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["courses", courseSlug, "materials"],
      });
      router.back();
    },
    onError: (error: any) => {
      toast.error("failed to update material");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Name</FormLabel>
              <FormControl>
                <Input placeholder="Book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount in hand</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  This is the amount of the material you have at hand
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
                <FormLabel>Material Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  This is the sale price of the material{" "}
                  <small className="italic">Without R</small>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button isLoading={mutation.isPending}>Update</Button>
      </form>
    </Form>
  );
};

export default EditmaterialForm;
