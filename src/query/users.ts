"use client";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { RoleName } from "@/types/roles";

export const useGetUsers = (role: RoleName) => {
  const query = useQuery({
    queryKey: ["users", role],
    queryFn: async () => {
      const response = await client.api.users[":role?"].$get({
        param: { role: role },
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
