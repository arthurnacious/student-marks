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
  classCount?: number;
}

export const useBulkDeleteFields = ({ courseSlug, classCount }: Props) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      if (classCount && classCount > 0) {
        throw new Error("Cannot delete fields for a course that has ran");
      }
      const response = await client.api.fields["bulk-delete"]["$post"]({
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Fields successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      if (courseSlug) {
        queryClient.invalidateQueries({
          queryKey: ["course", courseSlug, "fields"],
        });
      }
    },
    onError: (error: any) => {
      toast.error("failed to delete fields");
    },
  });

  return mutation;
};
