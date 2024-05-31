"use client";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCourses = () => {
  const query = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await client.api.courses.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
