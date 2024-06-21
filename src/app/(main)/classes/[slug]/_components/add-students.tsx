"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

interface Props {
  course: { name: string; slug: string; id: string };
}

const AddStudents: React.FC<Props> = ({ course }) => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values): Promise<ResponseType> => {
      const response = await client.api.classes.$post({ json: values });

      if (response.status === 422) {
        throw new Error({
          title: "student is already in class",
          statusCode: 422,
        });
      }
      return response.json();
    },
    onSuccess: (data) => {
      onOpenChange(false);
      toast.success("Class added successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      router.replace(`/classes/${data?.data ?? ""}`);
    },
    onError: (error: any) => {
      toast.error("failed to run class");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate({
      courseId: values.course,
      notes: values.notes,
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
          <PlusCircle className="mr-2" /> add a student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run a class</DialogTitle>
        </DialogHeader>
        <div></div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudents;
