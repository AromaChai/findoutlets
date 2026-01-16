"use client";

import { motion  , Easing } from "framer-motion";
import { SiSwiggy, SiZomato } from "react-icons/si";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1] as Easing,
    },
  },
};

export default function OrderPlatforms() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto pt-20 w-full md:max-w-lg max-w-md  px-6 md:pt-28"
    >
      {/* Title */}
      <motion.div variants={item} className="mb-6 text-center">
        <h2 className="text-lg font-semibold text-white">
          Order your favorite chai
        </h2>
        <p className="mt-1 text-sm text-white/70">
          Available on your preferred platform
        </p>
      </motion.div>

      {/* Card */}
      <div className="rounded-2xl bg-white/10 p-4.5 md:p-8 backdrop-blur-md shadow-lg ">
        <motion.div
          variants={container}
          className="flex flex-col gap-4"
        >
          {/* Swiggy */}
          <motion.a
            variants={item}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            href="#"
            className="flex w-full items-center gap-4 rounded-lg bg-[#FC8019] px-5 py-4 text-white shadow-md"
          >
            <SiSwiggy className="size-6" />
            <span className="text-sm font-semibold tracking-wide">
              Open in Swiggy
            </span>
          </motion.a>

          {/* Zomato */}
          <motion.a
            variants={item}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            href="#"
            className="flex w-full items-center gap-4 rounded-lg bg-[#E23744] px-5 py-4 text-white shadow-md"
          >
            <SiZomato className="size-6" />
            <span className="text-sm font-semibold tracking-wide">
              Open in Zomato
            </span>
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}
