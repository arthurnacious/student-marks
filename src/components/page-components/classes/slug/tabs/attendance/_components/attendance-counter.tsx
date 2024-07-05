import React, { FC } from "react";
import CountUp from "react-countup";

interface Props {
  totalAttendance: number;
}

const getProgressBarColor = (percentage: number) => {
  if (percentage >= 100) return "bg-green-500";
  if (percentage >= 75) return "bg-blue-500";
  if (percentage >= 50) return "bg-teal-500";
  return "bg-red-500";
};

const AttendanceCounter: FC<Props> = ({ totalAttendance }) => {
  const progressBarColor = getProgressBarColor(totalAttendance);

  return (
    <div className="w-full p-5">
      <div className="text-xl font-bold mb-2">
        Total Attendance:{" "}
        <CountUp start={0} end={totalAttendance} duration={2.5} suffix="%" />
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${progressBarColor} duration-700`}
          style={{ width: `${totalAttendance}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AttendanceCounter;
