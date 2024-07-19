"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { RoleName } from "@/types/roles";
import { InferRequestType, InferResponseType } from "hono";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const bulkDeleteUsersUrl = client.api.users["bulk-delete"].$post;
type ResponseType = InferResponseType<typeof bulkDeleteUsersUrl>;
type RequestType = InferRequestType<typeof bulkDeleteUsersUrl>["json"];

const bulkDeleteDependentsUrl =
  client.api["users-dependents"][":userId"]["bulk-delete"].$post;
type BulkDeleteUsersResponseType = InferResponseType<
  typeof bulkDeleteDependentsUrl
>;
type BulkDeleteUsersRequestType = InferRequestType<
  typeof bulkDeleteDependentsUrl
>["json"];

export const useGetUsersDepartments = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["user", userId, "departments"],
    queryFn: async () => {
      const response = await client.api.users[":id"].departments.$get({
        param: { id: userId! },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users departments");
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
      const response = await bulkDeleteUsersUrl({
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

export const useGetUserById = (id?: string) => {
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await client.api.users[":id"].$get({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const { data } = await response.json();
      return data;
    },
    enabled: !!id,
  });
  return query;
};

export const useGetUsersDependents = (id: string) => {
  const query = useQuery({
    queryKey: ["user", id, "dependents"],
    queryFn: async () => {
      const response = await client.api["users-dependents"][":userId"].$get({
        param: { userId: id },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useBulkDeleteDependents = (guardianId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    BulkDeleteUsersResponseType,
    Error,
    BulkDeleteUsersRequestType
  >({
    mutationFn: async (json) => {
      const response = await bulkDeleteDependentsUrl({
        param: { userId: guardianId },
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("dependents unlisted successfully");
      queryClient.invalidateQueries({
        queryKey: ["user", guardianId, "dependents"],
      });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to unlist dependents");
    },
  });

  return mutation;
};

export const useSearchUsers = ({
  keyword,
  role,
}: {
  keyword?: string;
  role?: RoleName;
}) => {
  const query = useQuery({
    queryKey: ["users", "search", keyword ?? undefined],
    queryFn: async () => {
      console.log({ keyword });
      const response = await client.api.users.search[":keyword"].role[
        ":role?"
      ].$get({
        param: {
          keyword: keyword ?? "",
          role: role ?? undefined,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const { data } = await response.json();
      return data;
    },
    enabled: !!(keyword && keyword.length >= 2),
  });
  return query;
};
