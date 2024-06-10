"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { RoleName } from "@/types/roles";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.users)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.users)["bulk-delete"]["$post"]
>["json"];

export const useGetUsersAcademies = (userId: string) => {
  const query = useQuery({
    queryKey: ["user", userId, "academies"],
    queryFn: async () => {
      const response = await client.api.users[":id"].academies.$get({
        param: { id: userId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users academies");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useBulkDeleteUsers = () => {
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
      queryClient.invalidateQueries({ queryKey: ["academies", null] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete academies");
    },
  });

  return mutation;
};

export const useGetUsers = (role?: RoleName) => {
  const query = useQuery({
    queryKey: ["users", role ?? null],
    queryFn: async () => {
      const response = await client.api.users[":role?"].$get({
        param: { role: role ?? "" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
