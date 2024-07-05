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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { paymentTypeName } from "@/types/payment";
import { Payment, getTotalPaymentAmount } from "@/lib/payments-functions";

interface Props {
  classId: string;
  studentId?: string;
  payments?: Payment[];
  setStudentId: Dispatch<SetStateAction<string | undefined>>;
}

const setPaymentUrl = client.api.payments[":classId"].pay.$post;
type ResponseType = InferResponseType<typeof setPaymentUrl>;
type RequestType = InferRequestType<typeof setPaymentUrl>["json"];

const StudentsPaymentModal: FC<Props> = ({
  classId,
  studentId,
  payments,
  setStudentId,
}) => {
  const [isOpen, setIsOpen] = useState(studentId ? true : false);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    amount: z.number().min(1, {
      message: "Payment amount must be at least 1 character long.",
    }),
    type: z.enum(
      Object.values(paymentTypeName) as [paymentTypeName, ...paymentTypeName[]]
    ),
  });

  const amount = getTotalPaymentAmount(studentId as string, payments);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount,
      type: paymentTypeName.CASH,
    },
  });

  type FormValues = z.input<typeof formSchema>;
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await setPaymentUrl({
        param: { classId },
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

  function onSubmit({ amount, type }: FormValues) {
    mutation.mutate({ amount, type, userId: studentId as string });
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
          <DialogTitle>Set Students Payment</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <p className="text-sm text-slate-400">
                Do not add a R sign, it will be added automatically.
              </p>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Amount Payed</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>

                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(paymentTypeName).map(
                                (paymentType) => (
                                  <SelectItem
                                    key={paymentType}
                                    value={paymentType}
                                  >
                                    {paymentType}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Button isLoading={mutation.isPending} className="mt-5">
                Set Payment
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentsPaymentModal;
