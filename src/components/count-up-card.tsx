"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC, ReactNode } from "react";
import CountUp from "react-countup";

interface Props {
  title: string;
  icon: ReactNode;
  count: number;
  index: number;
}

const CountUpCard: FC<Props> = ({ title, icon, count, index }) => {
  const duration = 2;
  const delay = index !== 0 ? index * duration : 1;
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-3xl font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-medium">
          <CountUp
            start={0}
            end={count}
            duration={duration}
            delay={delay - 2}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CountUpCard;
