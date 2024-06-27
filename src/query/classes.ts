"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

const removeStudentsFromClassUrl =
  client.api["class-students"][":id"].students["bulk-delete"].$post;
type ResponseType = InferResponseType<typeof removeStudentsFromClassUrl>;
type RequestType = InferRequestType<typeof removeStudentsFromClassUrl>["json"];

type ClassBySlugReturnType = InferResponseType<
  (typeof client.api.classes)[":slug"]["$get"]
>["data"];

export const useGetClasses = () => {
  const query = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await client.api.classes.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetClasseBySlug = (
  slug: string,
  initialData?: ClassBySlugReturnType
) => {
  const query = useQuery({
    queryKey: ["classes", slug],
    queryFn: async () => {
      const response = await client.api.classes[":slug"].$get({
        param: { slug },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch classe");
      }
      const data = await response.json();
      return data;
    },
    initialData: initialData ? { data: { ...initialData } } : undefined,
  });
  return query;
};

export const useBulkDeleteStudentsFromClass = (classId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await removeStudentsFromClassUrl({
        param: { id: classId },
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("students successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["classes", classId] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete students from class");
    },
  });

  return mutation;
};

export const useBulkDeleteClasses = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.classes["bulk-delete"]["$post"]({
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Classes successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete academies");
    },
  });

  return mutation;
};
