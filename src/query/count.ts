"use client";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSession } from "next-auth/react";

export const useGetAcademyCount = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["count", "academies"],
    queryFn: async () => {
      const response = await client.api.count.academies.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch academy count");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetCourseCount = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["count", "courses"],
    queryFn: async () => {
      const response = await client.api.count.courses.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch course count");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetClassCount = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["count", "classes"],
    queryFn: async () => {
      const response = await client.api.count.classes.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch class count");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetUserCount = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const query = useQuery({
    queryKey: ["count", "users"],
    queryFn: async () => {
      const response = await client.api.count.users.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch users count");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
