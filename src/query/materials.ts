"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.materials)["bulk-delete"]["$post"]
>["json"];

interface Props {
  courseSlug?: string;
}

export const useBulkDeleteMaterials = ({ courseSlug }: Props) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.materials["bulk-delete"]["$post"]({
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("materials successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      if (courseSlug) {
        queryClient.invalidateQueries({
          queryKey: ["course", courseSlug, "materials"],
        });
      }
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete academies");
    },
  });

  return mutation;
};
