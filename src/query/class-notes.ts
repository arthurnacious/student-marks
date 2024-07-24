import { client } from "@/lib/hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export const useGetClassNotes = (classId: string) => {
  const query = useQuery({
    queryKey: ["class-notes", classId],
    queryFn: async () => {
      const response = await client.api["class-notes"][":classId"].$get({
        param: { classId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch class notes");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

const deleteNoteUrl = client.api["class-notes"][":noteId"].$delete;
type RequestType = InferRequestType<typeof deleteNoteUrl>["param"]["noteId"];
type ResponseType = InferResponseType<typeof deleteNoteUrl>;

export const useDeleteClassNote = (classId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (noteId) => {
      const response = await deleteNoteUrl({
        param: { noteId },
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("notes successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["class-notes", classId] });
    },
    onError: (error: any) => {
      toast.error("failed to delete notes");
    },
  });

  return mutation;
};
