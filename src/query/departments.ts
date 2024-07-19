"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const bulkDeleteDepartmentsUrl = client.api.departments["bulk-delete"]["$post"];
type bulkDeleteDepartmentsResponseType = InferResponseType<
  typeof bulkDeleteDepartmentsUrl
>;
type bulkDeleteDepartmentsRequestType = InferRequestType<
  typeof bulkDeleteDepartmentsUrl
>["json"];

const bulkDeleteDepartmentLeadersUrl =
  client.api["department-leaders"][":id"]["bulk-delete"].$post;
type bulkDeleteDepartmentLeadersRequest = InferRequestType<
  typeof bulkDeleteDepartmentLeadersUrl
>["json"];
type bulkDeleteDepartmentLeadersResponse = InferResponseType<
  typeof bulkDeleteDepartmentLeadersUrl
>;

const bulkDeleteDepartmentLecturerUrl =
  client.api["department-lecturers"][":id"]["bulk-delete"].$post;
type bulkDeleteDepartmentRequest = InferRequestType<
  typeof bulkDeleteDepartmentLecturerUrl
>["json"];
type bulkDeleteDepartmentResponse = InferResponseType<
  typeof bulkDeleteDepartmentLecturerUrl
>;

interface initialData {
  id: string;
  name: string;
  slug: string;
  _count: {
    courses: number;
    lecturers: number;
  };
}

export const useGetDepartments = (initialData?: initialData[]) => {
  const query = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await client.api.departments.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }
      const { data } = await response.json();
      return data;
    },
    initialData: initialData ?? undefined,
  });
  return query;
};

export const useBulkDeleteDepartments = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    bulkDeleteDepartmentsResponseType,
    Error,
    bulkDeleteDepartmentsRequestType
  >({
    mutationFn: async (json) => {
      const response = await bulkDeleteDepartmentsUrl({
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Departments successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete departments");
    },
  });

  return mutation;
};

export const useGetDepartmentsCourses = (departmentId?: string) => {
  const query = useQuery({
    queryKey: ["departments", departmentId, "courses"],
    queryFn: async () => {
      const response = await client.api.departments[":id"].courses.$get({
        param: { id: departmentId! },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch departments courses");
      }
      const { data } = await response.json();
      return data;
    },
    enabled: !!departmentId,
  });
  return query;
};

export const useGetDepartmentBySlug = (departmentSlug: string) => {
  const query = useQuery({
    queryKey: ["departments", departmentSlug],
    queryFn: async () => {
      const response = await client.api.departments[":slug"].$get({
        param: { slug: departmentSlug },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch department");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetDepartmentsLeaders = (departmentSlug: string) => {
  const { data: departmentData, isLoading } =
    useGetDepartmentBySlug(departmentSlug);

  if (!isLoading && !departmentData) {
    throw new Error("Failed to fetch department");
  }
  const query = useQuery({
    queryKey: ["departments", departmentData?.id, "leaders"],
    queryFn: async () => {
      const response = await client.api["department-leaders"][":id"].$get({
        param: {
          id: departmentData?.id ?? "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch department");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetDepartmentsLecturers = (departmentSlug: string) => {
  const { data: departmentData, isLoading } =
    useGetDepartmentBySlug(departmentSlug);

  if (!isLoading && !departmentData) {
    throw new Error("Failed to fetch department");
  }
  const query = useQuery({
    queryKey: ["departments", departmentData?.id, "lecturers"],
    queryFn: async () => {
      const response = await client.api["department-lecturers"][":id"].$get({
        param: {
          id: departmentData?.id ?? "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch department");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetDepartmentsInventories = (departmentSlug: string) => {
  const { data: departmentData, isLoading } =
    useGetDepartmentBySlug(departmentSlug);

  if (!isLoading && !departmentData) {
    throw new Error("Failed to fetch department");
  }
  const query = useQuery({
    queryKey: ["departments", departmentData?.id, "inventories"],
    queryFn: async () => {
      const response = await client.api["department-inventories"][":id"].$get({
        param: {
          id: departmentData?.id ?? "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch department");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useBulkDeleteDepartmentsLeaders = (departmentId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    bulkDeleteDepartmentLeadersResponse,
    Error,
    bulkDeleteDepartmentLeadersRequest
  >({
    mutationFn: async (json) => {
      const response = await bulkDeleteDepartmentLeadersUrl({
        param: { id: departmentId },
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Department leaders successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({
        queryKey: ["departments", departmentId, "leaders"],
      });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete departments");
    },
  });

  return mutation;
};

export const useBulkDeleteDepartmentsLecturers = (departmentId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    bulkDeleteDepartmentResponse,
    Error,
    bulkDeleteDepartmentRequest
  >({
    mutationFn: async (json) => {
      const response = await bulkDeleteDepartmentLecturerUrl({
        param: { id: departmentId },
        json,
      });

      return response.json();
    },
    onSuccess: () => {
      toast.success("Department Lecturers successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({
        queryKey: ["departments", departmentId, "lecturers"],
      });
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("failed to delete departments");
    },
  });

  return mutation;
};
