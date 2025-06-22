"use client";

import { motion } from "motion/react";
import React from "react";

const Logo = () => {
  return (
    <motion.div
      className="self-start text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      roomvibe
    </motion.div>
  );
};

export default Logo;
