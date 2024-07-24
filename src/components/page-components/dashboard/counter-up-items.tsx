"use client";
import React from "react";
import CountUpCard from "@/components/count-up-card";
import { FaChalkboard, FaCrown } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import {
  useGetClassCount,
  useGetCourseCount,
  useGetUserCount,
} from "@/query/count";
import { Skeleton } from "@/components/ui/skeleton";

const CounterUpItems = () => {
  const courseCount = useGetCourseCount();
  const classCount = useGetClassCount();
  const userCount = useGetUserCount();

  const countUpCards = [
    {
      title: "Courses",
      icon: <FaChalkboard className="h-4 w-4 text-muted-foreground" />,
      count: courseCount.data?.count ?? 0,
    },
    {
      title: "Classes",
      icon: <FaChalkboard className="h-4 w-4 text-muted-foreground" />,
      count: classCount.data?.count ?? 0,
    },
    {
      title: "Users",
      icon: <FaChalkboardTeacher className="h-4 w-4 text-muted-foreground" />,
      count: userCount.data?.count ?? 0,
    },
  ];

  const isLoading =
    userCount.isLoading || courseCount.isLoading || classCount.isLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        {countUpCards.map((_, idx) => (
          <Skeleton key={idx} className="h-32 w-full mx-2" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
      {countUpCards.map(({ title, icon, count }, idx) => (
        <CountUpCard
          key={idx}
          title={title}
          icon={icon}
          count={count}
          index={idx}
        />
      ))}
    </div>
  );
};

export default CounterUpItems;
