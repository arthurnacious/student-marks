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
import { useCreateAcademy } from "@/query/academies";

interface Props {}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type formValues = z.input<typeof formSchema>;

const AddAcademyModal: React.FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useCreateAcademy();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: formValues) {
    mutate(values);
    onOpenChange(false);
  }

  function onOpenChange(b: boolean) {
    form.reset();

    setIsOpen(b);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Add Academy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an academy</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This wil be the name of the course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={isPending}>Create</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAcademyModal;
