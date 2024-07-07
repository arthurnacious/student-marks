"use client";
import { useGetUserById } from "@/query/users";
import React from "react";
import EditUserForm from "./edit-user-form";
import { notFound } from "next/navigation";

interface Props {
  userId: string;
}

const GetUserContainer: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useGetUserById(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return notFound();
  }

  return <EditUserForm user={data} />;
};

export default GetUserContainer;
