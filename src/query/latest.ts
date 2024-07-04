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

export const useGetLatestUsers = (limit: number) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["latest", "users", limit],
    queryFn: async () => {
      const response = await client.api.latest.users.$get({
        params: { limit },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch latest users");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const latestClassesUrl = client.api.latest.classes.$get;
export const useGetLatestClasses = (limit: number) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["latest", "classes", limit],
    queryFn: async () => {
      const response = await latestClassesUrl({
        params: { limit },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch latest classes");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
