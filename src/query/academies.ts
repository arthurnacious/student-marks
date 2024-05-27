"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import Error from "next/error";

type ResponseType = InferResponseType<typeof client.api.academies.$post>;
type RequestType = InferRequestType<typeof client.api.academies.$post>["json"];

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

export const useCreateAcademy = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.academies.$post({ json: values });
      console.log({ response });
      if (response.status === 422) {
        throw new Error({ title: "name is already taken", statusCode: 422 });
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Academy inserted successfully");
      queryClient.invalidateQueries({ queryKey: ["academies"] });
    },
    onError: (error) => {
      console.log({ error });
      toast.error("failed to insert academy");
    },
  });
  return mutation;
};
