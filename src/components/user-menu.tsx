"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { makeInitials } from "@/lib/utils";
import { signOutAction } from "@/lib/auth-actions";

interface Props {
  imageUrl?: string;
  name: string;
}

const UserMenu: React.FC<Props> = ({ imageUrl, name }) => {
  return (
    <Avatar>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt={name} />
          ) : (
            <AvatarFallback>{makeInitials(name ?? "N/A")}</AvatarFallback>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-5">
          <DropdownMenuItem onClick={() => signOutAction()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Avatar>
  );
};

export default UserMenu;
