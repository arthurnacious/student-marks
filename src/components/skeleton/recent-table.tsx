import React, { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  length?: number;
  headerCount?: number;
}

const RecentTableSkeleton: FC<Props> = ({ headerCount = 3, length = 10 }) => {
  return (
    <div>
      <Skeleton className="h-8 w-1/3" />
      <div className="mt-14">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {Array.from({ length: headerCount }).map((_, i) => (
            <Skeleton className="h-5 w-full" key={`header-${i}`} />
          ))}
        </div>
        {Array.from({ length }).map((_, i) => (
          <Skeleton className="h-10 w-full my-2" key={`user-${i}`} />
        ))}
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
};

export default RecentTableSkeleton;
