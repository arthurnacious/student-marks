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

export const useGetAcademies = () => {
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

export const useGetAcademiesCouses = (academyId?: string) => {
  const query = useQuery({
    queryKey: ["academies", academyId, "courses"],
    queryFn: async () => {
      const response = await client.api.academies[":id"].courses.$get({
        param: { id: academyId },
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
