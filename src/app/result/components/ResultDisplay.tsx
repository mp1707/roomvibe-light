"use client";
import { motion } from "framer-motion";
import DiffSlider from "@/app/components/DiffSlider";

interface ResultDisplayProps {
  localImageUrl: string;
  generatedImageUrl: string;
  openModal: (url: string) => void;
  itemVariants: any;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  localImageUrl,
  generatedImageUrl,
  openModal,
  itemVariants,
}) => {
  console.log("ResultDisplay props:", { localImageUrl, generatedImageUrl });

  return (
    <motion.div variants={itemVariants}>
      <DiffSlider
        beforeImageUrl={localImageUrl}
        afterImageUrl={generatedImageUrl}
        beforeLabel="Vorher"
        afterLabel="Nachher"
        onBeforeImageClick={openModal}
        onAfterImageClick={openModal}
        className="shadow-xl"
        aspectRatio="aspect-16/9"
        showInstructionText={true}
      />
    </motion.div>
  );
};

export default ResultDisplay;
