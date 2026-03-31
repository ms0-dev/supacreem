"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { HTMLAttributes } from "react";

export const CurrentUserAvatar = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { image: profileImage, name } = useCurrentUser();

  const initials = name
    ?.split(" ")
    ?.map((word: string) => word[0])
    ?.join("")
    ?.toUpperCase();

  return (
    <Avatar className={className} {...props}>
      {profileImage && <AvatarImage src={profileImage} alt={initials} />}
      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
    </Avatar>
  );
};
