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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import Error from "next/error";
import { InferRequestType, InferResponseType } from "hono";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useSearchCourses } from "@/query/courses";

interface Props {
  academyId: string;
}

const postTypeUrl = client.api.courses[":slug"].materials.$post;
type RequestType = InferRequestType<typeof postTypeUrl>["json"];
type ResponseType = InferResponseType<typeof postTypeUrl>;

const formSchema = z.object({
  course: z.string(),
  name: z.string().min(2, {
    message: "name must be at least 2 characters long",
  }),
  price: z.number(),
  amount: z.number(),
});

type formValues = z.input<typeof formSchema>;

const AddAcademyInventoryModal: React.FC<Props> = ({ academyId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [courseSlug, setCourseSlug] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: "",
      name: "",
      amount: 0,
      price: 10,
    },
  });

  const { data: courses, isLoading: loadingCourses } = useSearchCourses({
    keyword,
    academyId,
  });

  const { mutate: addMaterial, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (values) => {
      const response = await client.api.courses[":slug"].materials.$post({
        json: values,
        param: { slug: courseSlug! },
      });
      return response.json();
    },
    onMutate: async (newItem) => {
      const queryKey = ["academies", academyId, "inventories"];
      await queryClient.cancelQueries({
        queryKey,
      });

      const previousItems = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any[]) => {
        old ? [...old, newItem] : [newItem];
      });

      return { previousItems };
    },
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Material added successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["courses", courseSlug, "materials"],
      });
      queryClient.invalidateQueries({
        queryKey: ["academies", academyId, "inventories"],
      });
    },
    onError: (error: any) => {
      toast.error("failed to add material");
    },
  });

  function onSubmit(values: formValues) {
    addMaterial(values);
  }

  function onOpenChange(b: boolean) {
    setKeyword("");
    form.reset();
    setIsOpen(b);
  }

  const handleSelectChange = (id: string): void => {
    const selectedCourse = courses?.find((course) => course.id === id);
    if (selectedCourse) {
      setCourseSlug(selectedCourse.slug);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(b) => onOpenChange(b)}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="mr-2" /> Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormItem>
                <FormLabel>Search for course</FormLabel>
                <FormControl>
                  <Input
                    placeholder="maths"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Search for a course first</FormDescription>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem className="my-5">
                    <FormLabel>Course</FormLabel>
                    {keyword.length < 2 ? (
                      <div className="rounded-md bg-neutral-500 h-10 w-full flex items-center justify-center text-slate-200">
                        Search for Courses
                      </div>
                    ) : loadingCourses ? (
                      <Skeleton className="h-10 w-full flex items-center justify-center text-black">
                        <Loader2 className="size-4 mr-2 animate-spin " />
                        <span>Loading Courses</span>
                      </Skeleton>
                    ) : courses && courses.length === 0 ? (
                      <div className="rounded-md bg-neutral-500 h-10 w-full flex items-center justify-center text-slate-200">
                        No Courses found found
                      </div>
                    ) : (
                      <Select
                        onValueChange={(e) => {
                          handleSelectChange(e);
                          field.onChange(e);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses?.map(({ id, name, slug }) => (
                            <SelectItem key={id} value={id}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormDescription>
                      Select a course to assign material to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
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
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
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

              <Button isLoading={isPending} disabled={keyword.length < 2}>
                Add
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAcademyInventoryModal;
