"use client";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSession } from "next-auth/react";

export const useGetUsersGraphData = (year?: number) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["graph", "users", year],
    queryFn: async () => {
      const response = await client.api.graph.users.$get({
        params: { year: year ?? undefined },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users graph data");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const latestClassesUrl = client.api.graph.classes.$get;
export const useGetClassesGraphData = (year?: number) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["graph", "classes", year],
    queryFn: async () => {
      const response = await latestClassesUrl({
        params: { year: year ?? undefined },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch classes graph data");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
