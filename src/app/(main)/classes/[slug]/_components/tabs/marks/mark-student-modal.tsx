import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Field } from "../students";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

interface Props {
  classId: string;
  studentId?: string;
  fields: Field[];
  setStudentId: Dispatch<SetStateAction<string | undefined>>;
}

const postMarkUrl = client.api.marks[":studentId"].set.$post;
type ResponseType = InferResponseType<typeof postMarkUrl>;
type RequestType = InferRequestType<typeof postMarkUrl>["json"];

const MarkStudentModal: FC<Props> = ({
  classId,
  studentId,
  fields,
  setStudentId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    marks: z.object(
      fields.reduce((acc, field) => {
        acc[field.id] = z.number().min(1, {
          message: `${field.name} mark must be at least 1 character long.`,
        });
        return acc;
      }, {} as { [key: string]: z.ZodNumber })
    ),
  });

  type FormValues = z.input<typeof formSchema>;
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await postMarkUrl({
        param: { studentId: studentId ?? "" },
        json: values,
      });
      return response.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Marks set successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes", classId] });
    },
    onError: (error: any) => {
      toast.error("failed to set student marks");
    },
  });

  useEffect(() => {
    setIsOpen(studentId ? true : false);
  }, [studentId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marks: fields.reduce((acc, field) => {
        acc[field.id] = "";
        return acc;
      }, {} as { [key: string]: string }),
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  function onOpenChange(b: boolean) {
    form.reset();
    if (!b) {
      setStudentId(undefined);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marks Student</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <p className="text-sm text-slate-400">
                Do not add a % sign, that will be added automatically. Give
                Marks out of field total.
              </p>
              <div className="flex flex-wrap gap-2">
                {fields.map(({ name, id, total, marks }) => {
                  const mark = marks.find(
                    (mark) =>
                      mark.fieldId === id && mark.studentId === studentId
                  );
                  const value = mark?.amount ?? 0;
                  return (
                    <FormField
                      key={id}
                      control={form.control}
                      name={`marks.${id}`}
                      render={({ field }) => {
                        field.value = !field.value ? value : field.value;
                        return (
                          <FormItem>
                            <FormLabel>
                              {name}
                              <small className="italic ml-1">
                                (out of :{total})
                              </small>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="100"
                                {...field}
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                                className="max-w-xs"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}
              </div>
              <Button isLoading={mutation.isPending}>Mark Student</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkStudentModal;
