"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EnlargeIcon } from "./Icons";
import { useState, useRef, useCallback, useEffect } from "react";

interface DiffSliderProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  onBeforeImageClick?: (url: string) => void;
  onAfterImageClick?: (url: string) => void;
  className?: string;
  aspectRatio?: string;
  showInstructionText?: boolean;
}

const DiffSlider: React.FC<DiffSliderProps> = ({
  beforeImageUrl,
  afterImageUrl,
  beforeLabel = "Vorher",
  afterLabel = "Nachher",
  onBeforeImageClick,
  onAfterImageClick,
  className = "",
  aspectRatio = "aspect-16/9",
  showInstructionText = true,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Add safety checks for image URLs
  const safeBeforeImageUrl = beforeImageUrl || "";
  const safeAfterImageUrl = afterImageUrl || "";

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

  const handleBeforeClick = useCallback(() => {
    if (
      onBeforeImageClick &&
      safeBeforeImageUrl &&
      safeBeforeImageUrl.trim() !== ""
    ) {
      onBeforeImageClick(safeBeforeImageUrl);
    }
  }, [onBeforeImageClick, safeBeforeImageUrl]);

  const handleAfterClick = useCallback(() => {
    if (
      onAfterImageClick &&
      safeAfterImageUrl &&
      safeAfterImageUrl.trim() !== ""
    ) {
      onAfterImageClick(safeAfterImageUrl);
    }
  }, [onAfterImageClick, safeAfterImageUrl]);

  return (
    <motion.figure
      ref={containerRef}
      className={`relative ${aspectRatio} rounded-xl overflow-hidden select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Before/After Labels */}
      {onBeforeImageClick && (
        <motion.div
          className="absolute left-4 top-4 z-20 cursor-pointer select-none rounded-full bg-base-100/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-base-content/70 shadow-sm flex items-center gap-1 border border-base-100/20"
          onClick={handleBeforeClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <EnlargeIcon />
          {beforeLabel}
        </motion.div>
      )}

      {onAfterImageClick && (
        <motion.div
          className="absolute right-4 top-4 z-20 cursor-pointer select-none rounded-full bg-base-100/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-base-content/70 shadow-sm flex items-center gap-1 border border-base-100/20"
          onClick={handleAfterClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <EnlargeIcon />
          {afterLabel}
        </motion.div>
      )}

      {/* Base Image (After) */}
      <div className="absolute inset-0">
        <img
          src={safeAfterImageUrl}
          alt={afterLabel}
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
          src={safeBeforeImageUrl}
          alt={beforeLabel}
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
        <div className="w-0.5 h-full bg-base-100 shadow-lg" />

        {/* Slider Handle */}
        <motion.div
          ref={sliderRef}
          className="absolute w-8 h-8 bg-base-100 rounded-full shadow-lg flex items-center justify-center cursor-col-resize border border-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Handle Icon */}
          <svg
            className="w-4 h-4 text-base-content/60"
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
      {showInstructionText && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="hidden sm:block bg-base-100/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-base-content/70 shadow-sm border border-base-100/20">
            Schieben Sie den Regler zum Vergleichen
          </div>
        </div>
      )}
    </motion.figure>
  );
};

export default DiffSlider;
