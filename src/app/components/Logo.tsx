"use client";

import { motion } from "motion/react";
import React from "react";

const Logo = () => {
  return (
    <motion.h1
      className="self-start text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent mb-8"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      roomvibe
    </motion.h1>
  );
};

export default Logo;
