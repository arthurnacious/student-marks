"use client";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetAcademies = () => {
  const query = useQuery({
    queryKey: ["academies"],
    queryFn: async () => {
      const response = await client.api.academies.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch academies");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
