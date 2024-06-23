"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.classes)["bulk-delete"]["$post"]
>["json"];
type AttendanceRequestType = {
  studentId: string;
  role: string;
  classSessionId: string;
};

export const useGetSessionsByClassId = (classId: string, initialData?: any) => {
  const query = useQuery({
    queryKey: ["classes", classId, "sessions"],
    queryFn: async () => {
      const response = await client.api["class-sessions"][":classId"].$get({
        param: { classId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch class sessions");
      }
      const { data } = await response.json();
      return data;
    },
    initialData,
  });
  return query;
};

export const useBulkDeleteSessionsFromClass = (classId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.classes[":id"].students[
        "bulk-delete"
      ].$post({
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

export const useHandleAttendance = (classId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, AttendanceRequestType>({
    mutationFn: async (json) => {
      const response = await client.api.classes[":classId"].attendance.$post({
        param: { classId },
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("attendance logged successfully");
      queryClient.invalidateQueries({ queryKey: ["classes", classId] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to log attendance");
    },
  });
  return mutation;
};
