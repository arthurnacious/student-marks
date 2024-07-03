"use client";
import React, { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {}

const data = [
  { name: "Jan", Courses: 30, Users: 45, Classes: 25 },
  { name: "Feb", Courses: 50, Users: 70, Classes: 40 },
  { name: "Mar", Courses: 0, Users: 3, Classes: 10 },
  { name: "Apr", Courses: 0, Users: 4, Classes: 5 },
  { name: "May", Courses: 0, Users: 10, Classes: 5 },
  { name: "Jun", Courses: 1, Users: 12, Classes: 6 },
  { name: "Jul", Courses: 2, Users: 5, Classes: 10 },
];

const CoursesChart: FC<Props> = () => {
  return (
    <div className="w-full border border-neutral-500/50 bg-neutral-800/20 rounded p-5 mb-5">
      <h2 className="text-3xl">Overview</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Courses" fill="#4A6FA5" />
          <Bar dataKey="Users" fill="#4A7F50" />
          <Bar dataKey="Classes" fill="#A57F4A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoursesChart;
