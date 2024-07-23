"use client";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import NavigationLink from "./navigation-link";
import { HiChartBar } from "react-icons/hi";
import { FaLayerGroup } from "react-icons/fa";
import { FaChalkboard } from "react-icons/fa6";
import { GiCheckMark, GiTeacher } from "react-icons/gi";
import { PiUserSquare } from "react-icons/pi";
import { hasAbilityTo } from "@/lib/authorization";
import { useSession } from "next-auth/react";
import { RoleName } from "@/types/roles";
import { getEnumKeyByValue } from "@/lib/utils";

const containerVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 8,
      duration: 0.5,
    },
  },
  open: {
    width: "12rem",
    transition: {
      type: "spring",
      damping: 8,
      duration: 0.5,
    },
  },
};

const svgVariants = {
  close: {
    rotate: 360,
    transition: {
      type: "spring",
      damping: 7,
      duration: 0.5,
    },
  },
  open: {
    rotate: 180,
    transition: {
      type: "spring",
      damping: 7,
      duration: 0.5,
    },
  },
};

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const userRole = session?.data?.user
    ? getEnumKeyByValue(RoleName, session.data.user.role as RoleName)
    : undefined;
  // const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const start = isOpen ? "open" : "close";

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    containerControls.start(start);
    svgControls.start(start);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, svgControls, containerControls]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
    // setSelectedProject(null);
  };

  return (
    <motion.nav
      variants={containerVariants}
      animate={containerControls}
      initial="close"
      ref={navRef}
      className="bg-neutral-900 flex flex-col z-10 gap-20 p-5 fixed top-0 left-0 h-full min-h-screen shadow shadow-neutral-600"
    >
      <div className="flex flex-row w-full justify-between place-items-center">
        {/* logo */}
        <div className="size-10 relative flex justify-center items-center border border-orange-500 rounded-full font-graduate">
          <span className="text-teal-500">M</span>arkus
        </div>
        <button
          className="ml-1 p-1 rounded-full flex"
          onMouseDown={() => handleOpenClose()}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-8"
            variants={svgVariants}
            animate={svgControls}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </motion.svg>
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <NavigationLink name="Dashboard" to="/">
          <HiChartBar className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
        {hasAbilityTo({
          role: userRole,
          action: "readDepartment",
        }) && (
          <NavigationLink name="Departments" to="/departments">
            <FaLayerGroup className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
          </NavigationLink>
        )}{" "}
        {hasAbilityTo({
          role: userRole,
          action: "readCourse",
        }) && (
          <NavigationLink name="Courses" to="/courses">
            <FaChalkboard className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
          </NavigationLink>
        )}{" "}
        {hasAbilityTo({
          role: userRole,
          action: "readClass",
        }) && (
          <NavigationLink name="Classes" to="/classes">
            <GiTeacher className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
          </NavigationLink>
        )}
        {hasAbilityTo({
          role: userRole,
          action: "readUser",
        }) && (
          <NavigationLink name="Users" to="/users">
            <PiUserSquare className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
          </NavigationLink>
        )}
        {/* <NavigationLink name="My Marks" to="/marks">
          <GiCheckMark className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink> */}
      </div>
    </motion.nav>
  );
}

export default Navigation;
