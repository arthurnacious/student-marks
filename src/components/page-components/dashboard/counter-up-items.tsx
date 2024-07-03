"use client";
import React from "react";
import CountUpCard from "@/components/count-up-card";
import { FaChalkboard, FaCrown } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";

const CounterUpItems = () => {
  const countUpCards = [
    {
      title: "Courses",
      icon: <FaChalkboard className="h-4 w-4 text-muted-foreground" />,
      count: 40,
    },
    {
      title: "Classes",
      icon: <FaChalkboard className="h-4 w-4 text-muted-foreground" />,
      count: 500,
    },
    {
      title: "Users",
      icon: <FaChalkboardTeacher className="h-4 w-4 text-muted-foreground" />,
      count: 50,
    },
  ];
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
