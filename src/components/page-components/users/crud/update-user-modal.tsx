"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { Dispatch, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import Error from "next/error";
import { InferRequestType, InferResponseType } from "hono";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleName } from "@/types/roles";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useGetUserById } from "@/query/users";
import EditUserForm from "./edit-user-form";

interface Props {
  userId?: string;
  setUserId: Dispatch<React.SetStateAction<string | undefined>>;
}

const UpdateUserModal: React.FC<Props> = ({ userId, setUserId }: Props) => {
  const { data: user, isLoading } = useGetUserById(userId);

  function onOpenChange(b: boolean) {
    if (!b) {
      setUserId(undefined);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found...</div>;
  }

  return (
    <Dialog open={Boolean(userId)} onOpenChange={(b) => onOpenChange(b)}>
      <DialogContent className="max-w-fit duration-300">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <EditUserForm user={user} setUserId={setUserId} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;
