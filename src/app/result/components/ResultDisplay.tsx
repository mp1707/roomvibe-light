"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { EnlargeIcon } from "@/app/components/Icons";
import { useState, useRef, useCallback, useEffect } from "react";

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
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    const clampedPosition = Math.max(0, Math.min(100, position));
    setSliderPosition(clampedPosition);
  }, []);

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      updateSliderPosition(e.clientX);
    },
    [updateSliderPosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    },
    [isDragging, updateSliderPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      const touch = e.touches[0];
      updateSliderPosition(touch.clientX);
    },
    [updateSliderPosition]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      updateSliderPosition(touch.clientX);
    },
    [isDragging, updateSliderPosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <motion.figure
      ref={containerRef}
      className="relative aspect-16/9 rounded-xl overflow-hidden select-none"
      variants={itemVariants}
      style={{ touchAction: "none" }}
    >
      {/* Before/After Labels */}
      <motion.div
        className="absolute left-4 top-4 z-20 cursor-pointer select-none rounded-full bg-base-100/80 px-3 py-1.5 text-xs font-medium text-base-content/70 shadow-sm flex items-center gap-1"
        onClick={() => localImageUrl && openModal(localImageUrl)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <EnlargeIcon />
        Vorher
      </motion.div>
      <motion.div
        className="absolute right-4 top-4 z-20 cursor-pointer select-none rounded-full bg-base-100/80 px-3 py-1.5 text-xs font-medium text-base-content/70 shadow-sm flex items-center gap-1"
        onClick={() => openModal(generatedImageUrl)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <EnlargeIcon />
        Nachher
      </motion.div>

      {/* Base Image (After) */}
      <div className="absolute inset-0">
        <img
          src={generatedImageUrl}
          alt="Nach der Bearbeitung"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Overlay Image (Before) with clip-path */}
      <div
        className="absolute inset-0 transition-all duration-75 ease-out"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <Image
          src={localImageUrl}
          alt="Vor der Bearbeitung"
          width={800}
          height={800}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 cursor-col-resize z-10 flex items-center justify-center"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Slider Line */}
        <div className="w-0.5 h-full bg-white shadow-lg" />

        {/* Slider Handle */}
        <motion.div
          ref={sliderRef}
          className="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          {/* Handle Icon */}
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </motion.div>
      </div>

      {/* Instruction Text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="hidden sm:block bg-base-100/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-base-content/70 shadow-sm">
          Schieben Sie den Regler zum Vergleichen
        </div>
      </div>
    </motion.figure>
  );
};

export default ResultDisplay;
