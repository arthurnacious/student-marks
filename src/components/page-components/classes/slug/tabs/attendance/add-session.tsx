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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import Error from "next/error";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { TheClass } from "../students";

interface Props {
  theClass: TheClass;
}
const postUrl = client.api["class-sessions"][":classId"].$post;
type ResponseType = InferResponseType<typeof postUrl>;
type RequestType = InferRequestType<typeof postUrl>["json"];

const formSchema = z.object({
  name: z.string(),
});

type formValues = z.input<typeof formSchema>;

const AddSessionsModal: React.FC<Props> = ({ theClass }) => {
  const [keyword, setKeyword] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values): Promise<ResponseType> => {
      const response = await postUrl({
        param: { classId: theClass.id },
        json: values,
      });

      if (response.status === 422) {
        throw new Error({
          title: "name is already taken for this class",
          statusCode: 422,
        });
      }
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast.success("Session added successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes", theClass.id] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to add session");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate(values);
    form.reset();
  }

  function onOpenChange(b: boolean) {
    form.reset();
    setIsOpen(b);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Add Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add session to class</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="my-5">
                    <FormLabel>Session Name</FormLabel>

                    <Input placeholder="Session 1" {...field} />
                    <FormDescription>
                      Give the session a name <small>(i.e Monday)</small>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={mutation.isPending}>Add</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSessionsModal;
