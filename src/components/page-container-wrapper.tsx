import { cn, makeInitials } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserMenu from "./user-menu";

interface Props {
  title?: string;
  trail?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const PageContainerWrapper: React.FC<Props> = async ({
  title,
  trail,
  className,
  children,
}) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className={cn("flex flex-col p-10 ml-20 w-full gap-5", className)}>
      <div className="flex justify-between items-baseline">
        <div className="flex flex-col justify-center">
          {!!title && (
            <h1 className="text-4xl text-neutral-200 uppercase font-SpaceGrotesk">
              {title}
            </h1>
          )}
          {!!trail && trail}
        </div>
        <div className="flex gap-5 items-center">
          <span className="text-xl hidden md:block">{session.user.name}</span>

          <UserMenu
            imageUrl={session.user.image as string}
            name={session.user.name as string}
          />
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default PageContainerWrapper;
