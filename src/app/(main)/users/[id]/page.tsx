import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageContainerWrapper from "@/components/page-container-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { client } from "@/lib/hono";
import { Edit, SquareCheckBigIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { formatDate } from "date-fns";
import {
  calculateBackgroundColor,
  calculateTotal,
} from "@/lib/marks-functions";
import { cn, getPrice } from "@/lib/utils";

interface Props {
  params: {
    id: string;
  };
}

const ViewUserPage: React.FC<Props> = async ({ params: { id } }) => {
  const [userData, marks] = await Promise.all([
    client.api.users[":id"]
      .$get({
        param: { id },
      })
      .then((response) => response.json()),
    client.api.marks[":userId"]
      .$get({
        param: { userId: id },
      })
      .then((response) => response.json()),
  ]);

  const user = userData?.data;

  if (!user) {
    return notFound();
  }

  return (
    <PageContainerWrapper title="View User">
      <div className="bg-gradient-to-r from-teal-950 to-black/50 rounded-lg">
        <div className="flex items-center justify-between bg-[url('/bonus.png')] bg-right rounded-lg p-8 text-center h-full">
          <div className="bg-black/95 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <div>
              <h3 className="">{user.role}</h3>
              <span className="text-xs">{user.email}</span>
              <div className="mt-2 flex gap-2">
                {user.role === "Student" && (
                  <Link
                    href={`/users/${user.id}/marks`}
                    className={buttonVariants({ className: "gap-2" })}
                  >
                    <SquareCheckBigIcon className="size-5" /> View Marks Sheet
                  </Link>
                )}
                <Link
                  href={`/users/${user.id}/marks`}
                  className={buttonVariants({
                    className: "gap-2 bg-neutral-400/50",
                  })}
                >
                  <Edit className="size-5" /> Edit Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <h2>Enrollment History</h2>
        <p className="text-slate-400 text-xs">
          Check out a list of all courses available to you.
        </p>
        <div className="py-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Course</TableHead>
                <TableHead>Academy</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <div className="flex flex-col items-center ">Payment</div>
                </TableHead>
                <TableHead className="text-right">Mark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marks.map((mark) => {
                const total = calculateTotal(mark.class.course.fields);
                console.log({ mark: mark.class.payments[0] });
                return (
                  <TableRow key={mark.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1 items-center text-nowrap">
                        <div>{mark.class.course.name}</div>
                        <div className="text-xs text-slate-500">
                          {getPrice(mark.class.course.price)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {mark.class.course?.academy?.name} Academy
                    </TableCell>
                    <TableCell>{mark.class.lecturer.name}</TableCell>
                    <TableCell>
                      {formatDate(mark.class.createdAt, "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center ">
                        {mark.class.payments[0] ? (
                          <div className="flex flex-col gap-1 items-center text-nowrap">
                            {getPrice(mark.class.payments[0]?.amount ?? 0)}
                            <div className="text-xs text-slate-500">
                              {mark.class.payments[0].type}
                            </div>
                          </div>
                        ) : (
                          <span className="text-red-500">Outstanding</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-center items-center">
                        {mark.class.course.fields.map((field) => (
                          <div
                            key={field.name}
                            className="flex flex-col gap-2 items-center"
                          >
                            <span className="text-xs">{field.name}</span>
                            <span className="bg-neutral-950 px-2 py-1 rounded-sm text-sm">
                              {field.marks[0].amount} / {field.total}
                            </span>
                          </div>
                        ))}
                        <span
                          className={cn(
                            calculateBackgroundColor(total),
                            "text-xl px-2 py-1 rounded font-bold"
                          )}
                        >
                          {total} %
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainerWrapper>
  );
};

export default ViewUserPage;
