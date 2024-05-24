"use client";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import NavigationLink from "./navigation-link";
import { HiChartBar } from "react-icons/hi";
import { FaLayerGroup } from "react-icons/fa";
import { FaChalkboard } from "react-icons/fa6";
import { GiCheckMark, GiTeacher } from "react-icons/gi";
import { PiUserSquare } from "react-icons/pi";

const containerVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};

const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();

  useEffect(() => {
    const start = isOpen ? "open" : "close";

    containerControls.start(start);
    svgControls.start(start);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
    setSelectedProject(null);
  };

  return (
    <motion.nav
      variants={containerVariants}
      animate={containerControls}
      initial="close"
      className="bg-neutral-900 flex flex-col z-10 gap-20 p-5 fixed top-0 left-0 h-full min-h-screen shadow shadow-neutral-600"
    >
      <div className="flex flex-row w-full justify-between place-items-center">
        {/* logo */}
        <div className="w-10 h-10 relative flex justify-center items-center border border-orange-500 rounded-full">
          Creare
        </div>
        <button
          className="p-1 rounded-full flex"
          onMouseDown={() => handleOpenClose()}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
        <NavigationLink name="Academies" to="/academies">
          <FaLayerGroup className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
        <NavigationLink name="Courses" to="/courses">
          <FaChalkboard className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
        <NavigationLink name="Classes" to="/classes">
          <GiTeacher className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
        <NavigationLink name="Marks" to="/marks">
          <GiCheckMark className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
        <NavigationLink name="Users" to="/users">
          <PiUserSquare className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
      </div>
    </motion.nav>
  );
}

export default Navigation;
