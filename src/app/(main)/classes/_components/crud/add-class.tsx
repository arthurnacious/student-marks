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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import Error from "next/error";
import { InferRequestType, InferResponseType } from "hono";
import Link from "next/link";
import { useGetUsersAcademies } from "@/query/users";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAcademiesCouses } from "@/query/academies";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface Props {}

type ResponseType = InferResponseType<typeof client.api.classes.$post>;
type RequestType = InferRequestType<typeof client.api.classes.$post>["json"];

const formSchema = z.object({
  notes: z.string(),
  course: z.string().min(1, {
    message: "Academy is required.",
  }),
});

type formValues = z.input<typeof formSchema>;

const AddClassModal: React.FC<Props> = ({}) => {
  const [selectedAcademy, setAcademy] = useState<
    { name: string; id: string } | undefined
  >(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: "",
      notes: "",
    },
  });

  const userId = "39cc2560-ca08-4c75-bf10-093400c2a27d";

  const { data: usersAcademies, isLoading: loadingAcademies } =
    useGetUsersAcademies(userId);

  const { data: courses, isLoading: loadingCourses } = useGetAcademiesCouses(
    selectedAcademy?.id
  );

  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.classes.$post({ json: values });

      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: (data) => {
      onOpenChange(false);
      toast.success("Class added successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      router.replace(`/classes/${data.data}`);
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
          <PlusCircle className="mr-2" /> Run new class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Class</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormItem className="my-5">
                <FormLabel>Academy</FormLabel>
                {loadingAcademies ? (
                  <Skeleton className="h-10 w-full flex items-center justify-center text-black">
                    <Loader2 className="size-4 mr-2 animate-spin " />
                    <span>Loading academies</span>
                  </Skeleton>
                ) : (
                  <Select
                    onValueChange={(v) =>
                      setAcademy(usersAcademies?.find((a) => a.id === v))
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an academy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {usersAcademies?.map((academy) => (
                        <SelectItem key={academy.id} value={academy.id}>
                          {academy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormDescription>
                  This is just a lis of academies you are lecturing in.
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem className="my-5">
                    <FormLabel>Course</FormLabel>
                    {!selectedAcademy ? (
                      <div className="rounded-md bg-neutral-500 h-10 w-full flex items-center justify-center text-slate-200">
                        Select an Academy
                      </div>
                    ) : loadingCourses ? (
                      <Skeleton className="h-10 w-full flex items-center justify-center text-black">
                        <Loader2 className="size-4 mr-2 animate-spin " />
                        <span>Loading courses</span>
                      </Skeleton>
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses?.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormDescription>
                      The course you are presenting today..
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="For holiday school" {...field} />
                    </FormControl>
                    <FormDescription>Add a bit of notes here</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={mutation.isPending}>Go</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
