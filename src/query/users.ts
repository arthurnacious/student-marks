"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { RoleName } from "@/types/roles";
import { InferRequestType, InferResponseType } from "hono";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.users)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.users)["bulk-delete"]["$post"]
>["json"];

export const useGetUsersAcademies = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;
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
    enabled: !!userId,
  });
  return query;
};

export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.users["bulk-delete"]["$post"]({
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Users successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["users", null] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete users");
    },
  });

  return mutation;
};

export const useGetUsers = (role?: RoleName) => {
  const query = useQuery({
    queryKey: ["users", role ?? null],
    queryFn: async () => {
      const response = await client.api.users.role[":role?"].$get({
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

export const useSearchUsers = (keyword?: string) => {
  const query = useQuery({
    queryKey: ["users", "search", keyword ?? undefined],
    queryFn: async () => {
      console.log({ keyword });
      const response = await client.api.users.search[":keyword"].$get({
        param: { keyword: keyword ?? "" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const { data } = await response.json();
      return data;
    },
    enabled: Boolean(keyword) && keyword.length >= 2,
  });
  return query;
};
