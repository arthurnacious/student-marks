"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.academies)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.academies)["bulk-delete"]["$post"]
>["json"];

interface initialData {
  id: string;
  name: string;
  slug: string;
  _count: {
    courses: number;
    lecturers: number;
  };
}

export const useGetAcademies = (initialData?: initialData[]) => {
  const query = useQuery({
    queryKey: ["academies"],
    queryFn: async () => {
      const response = await client.api.academies.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch academies");
      }
      const { data } = await response.json();
      return data;
    },
    initialData: initialData ?? undefined,
  });
  return query;
};

export const useBulkDeleteAcademies = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.academies["bulk-delete"]["$post"]({
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Academies successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["academies"] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete academies");
    },
  });

  return mutation;
};

export const useGetAcademiesCourses = (academyId?: string) => {
  const query = useQuery({
    queryKey: ["academies", academyId, "courses"],
    queryFn: async () => {
      const response = await client.api.academies[":id"].courses.$get({
        param: { id: academyId! },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch academies courses");
      }
      const { data } = await response.json();
      return data;
    },
    enabled: !!academyId,
  });
  return query;
};

export const useGetAcademyBySlug = (academySlug: string) => {
  const query = useQuery({
    queryKey: ["academies", academySlug],
    queryFn: async () => {
      const response = await client.api.academies[":slug"].$get({
        param: { slug: academySlug },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch academiy");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetAcademiesHeads = (academySlug: string) => {
  const { data: academyData, isLoading } = useGetAcademyBySlug(academySlug);

  if (!isLoading && !academyData) {
    throw new Error("Failed to fetch academy");
  }
  const query = useQuery({
    queryKey: ["academies", academyData?.id, "heads"],
    queryFn: async () => {
      const response = await client.api["academy-heads"][":id"].$get({
        param: {
          id: academyData?.id ?? "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch academy");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useBulkDeleteAcademiesHeads = (academyId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api["academy-heads"][":id"]["bulk-delete"][
        "$post"
      ]({
        param: { id: academyId },
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Academy heads successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["academies"] });
      queryClient.invalidateQueries({
        queryKey: ["academies", academyId, "heads"],
      });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete academies");
    },
  });

  return mutation;
};
