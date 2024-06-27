"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType } from "hono";

const deleteSessionsUrl =
  client.api["class-sessions"][":id"].sessions["bulk-delete"].$post;
type RequestType = InferRequestType<typeof deleteSessionsUrl>["json"];

const getStudentsMarksUrl = client.api.marks[":userId"].$get;
type AttendanceRequestType = {
  studentId: string;
  role: string;
  classSessionId: string;
};

export const useGetStudentsMarks = (studentId: string) => {
  const query = useQuery({
    queryKey: ["students", studentId, "marks"],
    queryFn: async () => {
      const response = await getStudentsMarksUrl({
        param: { userId: studentId },
      });

      const data = await response.json();
      return data;
    },
  });
  return query;
};

export const useBulkDeleteSessionsMarks = (classId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await deleteSessionsUrl({
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
      toast.error("failed to sessions");
    },
  });

  return mutation;
};
