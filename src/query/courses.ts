"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType } from "hono";

const bulkDeleteUrl = client.api.courses["bulk-delete"].$post;
type RequestType = InferRequestType<typeof bulkDeleteUrl>["json"];

export type field = {
  id: string;
  name: string;
  courseId: string | null;
  total: number;
};

export const useGetCourses = () => {
  const query = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await client.api.courses.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useBulkDeleteCourses = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await bulkDeleteUrl({
        json,
      });

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Courses successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete academies");
    },
  });

  return mutation;
};

export const useGetCourseMaterials = (slug: string) => {
  const query = useQuery({
    queryKey: ["courses", slug, "materials"],
    queryFn: async () => {
      const response = await client.api.courses[":slug"].materials.$get({
        param: { slug },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const { data } = await response.json();
      return data?.materials;
    },
    enabled: !!slug,
  });
  return query;
};

export const useGetCourseFields = (slug: string, initialData?: field[]) => {
  const query = useQuery({
    queryKey: ["courses", slug, "fields"],
    initialData,
    queryFn: async () => {
      const response = await client.api.courses[":slug"].fields.$get({
        param: { slug },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch courses fields");
      }
      const { data } = await response.json();
      return data?.fields;
    },
    enabled: !!slug,
  });
  return query;
};
