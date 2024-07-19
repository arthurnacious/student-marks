"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch } from "react";
import { useGetUserById } from "@/query/users";
import EditUserForm from "./edit-user-form";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  userId?: string;
  setUserId: Dispatch<React.SetStateAction<string | undefined>>;
}

const UpdateUserModal: React.FC<Props> = ({ userId, setUserId }: Props) => {
  const { data: user, isLoading } = useGetUserById(userId);

  if (!userId) {
    return null;
  }

  function onOpenChange(b: boolean) {
    if (!b) {
      setUserId(undefined);
    }
  }

  return (
    <Dialog open={Boolean(userId)} onOpenChange={(b) => onOpenChange(b)}>
      <DialogContent className="max-w-fit duration-300">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingUserEditForm />
        ) : !user ? (
          <div>User not found...</div>
        ) : (
          <EditUserForm user={user} setUserId={setUserId} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;

function LoadingUserEditForm() {
  return (
    <div className=" min-w-96">
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="gap-2 mb-5">
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="gap-2 mb-5">
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
