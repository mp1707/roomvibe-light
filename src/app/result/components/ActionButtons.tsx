"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import ReusableButton from "@/app/components/AnimatedButton";
import { DownloadIcon, EditIcon, StartOverIcon } from "@/app/components/Icons";

interface ActionButtonsProps {
  itemVariants: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ itemVariants }) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row gap-4 items-evenly justify-center"
      variants={itemVariants}
    >
      <ReusableButton color={"blue"}>
        <DownloadIcon />
        Bild herunterladen
      </ReusableButton>
      <Link href="/suggestions" className="btn btn-ghost rounded-lg h-14">
        <EditIcon />
        Vorschläge bearbeiten
      </Link>
      <Link href="/" className="btn btn-ghost rounded-lg h-14">
        <StartOverIcon />
        Neu beginnen
      </Link>
    </motion.div>
  );
};

export default ActionButtons;
