import React, { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  rows?: number;
  cols: number;
  searchable?: boolean;
}

const TableSkeleton: FC<Props> = ({ rows = 7, cols, searchable = true }) => {
  return (
    <ScrollArea className="flex flex-col justify-center max-w-[calc(100vw-15rem)]">
      {searchable && <Skeleton className="h-10 w-80 my-2" />}
      <div>
        <table>
          <thead>
            <tr>
              {Array(cols)
                .fill(null)
                .map((_, rowIndex) => (
                  <th key={`th-row-${rowIndex}`}>
                    <Skeleton className="h-5 w-56 min-w-60 my-2" />
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {Array(rows)
              .fill(null)
              .map((_, rowIndex) => (
                <tr key={`td-row-${rowIndex}`}>
                  {Array(cols)
                    .fill(null)
                    .map((_, colIndex) => (
                      <td key={`${rowIndex}-${colIndex}`}>
                        <Skeleton className="h-5 w-56 min-w-60 my-2" />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};

export default TableSkeleton;
