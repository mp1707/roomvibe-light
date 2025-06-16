"use client";

import { Images } from "@/app/components/images";
import UploadForm from "@/app/components/UploadForm";
import { motion } from "motion/react";
import { useState } from "react";

export default function Home() {
  const [showText, setShowText] = useState(false);
  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200">
      <motion.div
        className="card w-full max-w-md bg-base-100 shadow-xl p-6"
        initial={{ borderRadius: "0.5rem" }}
        animate={{ borderRadius: showText ? "1rem" : "0.5rem" }}
        layout
      >
        {showText && (
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <UploadForm />
          </motion.div>
        )}
        {!showText && (
          <button onClick={() => setShowText(true)} className="btn btn-primary btn-lg w-full">
            Upload Avatar
          </button>
        )}
      </motion.div>
    </main>
  );
}
