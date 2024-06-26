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
import UserInfo from "@/components/page-components/users/id/user-info";

interface Props {
  params: {
    id: string;
  };
}

const ViewUserPage: React.FC<Props> = ({ params: { id } }) => {
  return (
    <PageContainerWrapper title="View User">
      <UserInfo studentId={id} />
    </PageContainerWrapper>
  );
};

export default ViewUserPage;
