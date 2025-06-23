"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedButton from "@/app/components/AnimatedButton";
import { DownloadIcon, EditIcon, StartOverIcon } from "@/app/components/Icons";
import { downloadImage, isDownloadSupported } from "@/utils/downloadUtils";
import toast from "react-hot-toast";

interface ActionButtonsProps {
  itemVariants: any;
  generatedImageUrl?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  itemVariants,
  generatedImageUrl,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!generatedImageUrl) {
      toast.error("Kein Bild zum Herunterladen verfügbar.");
      return;
    }

    if (!isDownloadSupported()) {
      toast.error("Download wird in diesem Browser nicht unterstützt.");
      return;
    }

    setIsDownloading(true);
    try {
      toast.loading("Bild wird vorbereitet...", { id: "download" });
      await downloadImage(generatedImageUrl);
      toast.dismiss("download");
      toast.success("Bild erfolgreich heruntergeladen!");
    } catch (error) {
      toast.dismiss("download");
      const errorMessage =
        error instanceof Error ? error.message : "Download fehlgeschlagen.";
      toast.error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row gap-4 items-evenly justify-center"
      variants={itemVariants}
    >
      <AnimatedButton
        color="blue"
        onClick={handleDownload}
        disabled={isDownloading || !generatedImageUrl}
      >
        <DownloadIcon />
        {isDownloading ? "Wird heruntergeladen..." : "Bild herunterladen"}
      </AnimatedButton>
      <Link
        href="/suggestions"
        className="btn btn-ghost text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg h-14"
      >
        <EditIcon />
        Vorschläge bearbeiten
      </Link>
      <Link
        href="/"
        className="btn btn-ghost text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg h-14"
      >
        <StartOverIcon />
        Neu beginnen
      </Link>
    </motion.div>
  );
};

export default ActionButtons;
