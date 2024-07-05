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
import { Textarea } from "@/components/ui/textarea";

interface Props {
  classId: string;
}
const addClassNoteUrl = client.api["class-notes"][":classId"].$post;
type ResponseType = InferResponseType<typeof addClassNoteUrl>;
type RequestType = InferRequestType<typeof addClassNoteUrl>["json"];

const formSchema = z.object({
  body: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type formValues = z.input<typeof formSchema>;

const AddNoteModal: React.FC<Props> = ({ classId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  // const { mutate, isPending, isError, error, } = useCreateAcademy();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
    },
  });

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await addClassNoteUrl({
        json: values,
        param: { classId: classId },
      });
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Note created successfully");
      queryClient.invalidateQueries({ queryKey: ["class-notes", classId] });
    },
    onError: (error: any) => {
      toast.error("failed to create note");
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
          <PlusCircle className="mr-2" /> Add Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a note</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add a note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="add notes to the class"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Notes are just to remind you or whoeve about some class
                      details
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={mutation.isPending}>Create</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteModal;
