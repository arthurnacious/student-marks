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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetAcademiesCourses } from "@/query/academies";
import { toast } from "sonner";
import Error from "next/error";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { ClassType } from "@/types/class";
import { useGetUsersAcademies } from "@/query/users";
import { useRouter } from "next/navigation";

interface Props {}

type ResponseType = InferResponseType<typeof client.api.classes.$post>;
type RequestType = InferRequestType<typeof client.api.classes.$post>["json"];

const formSchema = z.object({
  notes: z.string(),
  course: z.string().min(1, {
    message: "Academy is required.",
  }),
  type: z.nativeEnum(ClassType),
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
      type: ClassType.FT,
    },
  });

  const { data: usersAcademies, isLoading: loadingAcademies } =
    useGetUsersAcademies();

  const { data: courses, isLoading: loadingCourses } = useGetAcademiesCourses(
    selectedAcademy?.id
  );

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values): Promise<ResponseType> => {
      const response = await client.api.classes.$post({ json: values });

      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if ("slug" in data) {
        onOpenChange(false);
        toast.success("Class added successfully");
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        return router.replace(`/classes/${data.slug ?? ""}`);
      }

      throw new Error({ title: "failed to run class", statusCode: 500 });
    },
    onError: (error: any) => {
      toast.error("failed to run class");
    },
  });

  function onSubmit(values: formValues) {
    mutation.mutate({
      courseId: values.course,
      type: values.type,
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
          <DialogTitle>Run a class</DialogTitle>
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
                name="type"
                render={({ field }) => (
                  <FormItem className="my-5">
                    <FormLabel>Class Type</FormLabel>
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
                        {Object.values(ClassType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The course you are presenting today..
                    </FormDescription>
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
