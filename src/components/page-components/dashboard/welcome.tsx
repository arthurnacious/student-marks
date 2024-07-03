"use client";
import React, { FC, useState, useEffect } from "react";
import { format, differenceInMilliseconds, startOfTomorrow } from "date-fns";

import { useSession } from "next-auth/react";

interface Props {}

const Welcome: FC<Props> = ({}) => {
  const { data, status } = useSession();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const updateDate = () => setDate(new Date());

    const now = new Date();
    const msUntilMidnight = differenceInMilliseconds(startOfTomorrow(), now);

    const timeoutID = setTimeout(() => {
      updateDate();
      const intervalID = setInterval(updateDate, 24 * 60 * 60 * 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalID);
    }, msUntilMidnight);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutID);
  }, []);

  return (
    <div className="w-fit border border-neutral-500/50 bg-neutral-800/20 rounded p-5 mb-5">
      <h2 className="text-3xl">
        Welcome <span className="text-neutral-400">{data?.user?.name}</span>
      </h2>
      <p>Cheers, and happy activities - {format(date, "MMMM d yyyy")}</p>
    </div>
  );
};

export default Welcome;
