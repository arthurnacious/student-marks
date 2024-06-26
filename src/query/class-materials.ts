import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { toast } from "sonner";

const toggleStudentMaterialClass =
  client.api["class-materials"][":classId"]["toggle-student"].$post;
type materialRequestType = InferRequestType<
  typeof toggleStudentMaterialClass
>["json"];

export const useCheckMaterials = (classId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, materialRequestType>({
    mutationFn: async (json) => {
      const response = await toggleStudentMaterialClass({
        param: { classId },
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("material logged successfully");
      queryClient.invalidateQueries({ queryKey: ["classes", classId] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to log material");
    },
  });
  return mutation;
};
