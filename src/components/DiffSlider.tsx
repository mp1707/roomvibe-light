"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useCallback, useEffect, memo, useMemo } from "react";

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

const DiffSlider = memo<DiffSliderProps>(
  ({
    beforeImageUrl,
    afterImageUrl,
    beforeLabel = "Vorher",
    afterLabel = "Nachher",
    onBeforeImageClick,
    onAfterImageClick,
    className = "",
    aspectRatio = "aspect-[4/3]",
    showInstructionText = false,
  }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    // Memoize safe image URLs to prevent unnecessary re-renders
    const safeBeforeImageUrl = useMemo(
      () => beforeImageUrl || "",
      [beforeImageUrl]
    );
    const safeAfterImageUrl = useMemo(
      () => afterImageUrl || "",
      [afterImageUrl]
    );

    // Memoized position calculation
    const updatePosition = useCallback((clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    }, []);

    // Optimized mouse handlers
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updatePosition(e.clientX);
      },
      [updatePosition]
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e.clientX);
      },
      [isDragging, updatePosition]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Optimized touch handlers
    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const touch = e.touches[0];
        if (touch) {
          updatePosition(touch.clientX);
        }
      },
      [updatePosition]
    );

    const handleTouchMove = useCallback(
      (e: TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
          updatePosition(touch.clientX);
        }
      },
      [isDragging, updatePosition]
    );

    const handleTouchEnd = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Event listeners - optimized with proper cleanup
    useEffect(() => {
      if (!isDragging) return;

      const options = { passive: false };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, options);
      document.addEventListener("touchend", handleTouchEnd);

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

    // Memoized click handlers
    const handleBeforeClick = useCallback(() => {
      if (onBeforeImageClick && safeBeforeImageUrl) {
        onBeforeImageClick(safeBeforeImageUrl);
      }
    }, [onBeforeImageClick, safeBeforeImageUrl]);

    const handleAfterClick = useCallback(() => {
      if (onAfterImageClick && safeAfterImageUrl) {
        onAfterImageClick(safeAfterImageUrl);
      }
    }, [onAfterImageClick, safeAfterImageUrl]);

    // Memoized styles for better performance
    const clipPath = useMemo(
      () => `inset(0 ${100 - sliderPosition}% 0 0)`,
      [sliderPosition]
    );
    const sliderLeftPosition = useMemo(
      () => `${sliderPosition}%`,
      [sliderPosition]
    );

    // Early return if no images
    if (!safeBeforeImageUrl || !safeAfterImageUrl) {
      return (
        <div
          className={`${aspectRatio} rounded-xl bg-base-200 flex items-center justify-center ${className}`}
        >
          <span className="text-base-content/40">Bilder werden geladen...</span>
        </div>
      );
    }

    return (
      <motion.figure
        ref={containerRef}
        className={`relative ${aspectRatio} rounded-xl overflow-hidden select-none cursor-ew-resize ${className}`}
        style={{ touchAction: "none" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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
            <MagnifyingGlassPlusIcon className="w-4 h-4" />
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
            <MagnifyingGlassPlusIcon className="w-4 h-4" />
            {afterLabel}
          </motion.div>
        )}

        {/* Base Image (After) */}
        <div className="absolute inset-0">
          <Image
            src={safeAfterImageUrl}
            alt={afterLabel}
            fill
            className="object-cover"
            draggable={false}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Overlay Image (Before) with clip-path */}
        <div className="absolute inset-0" style={{ clipPath }}>
          <Image
            src={safeBeforeImageUrl}
            alt={beforeLabel}
            fill
            className="object-cover"
            draggable={false}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Interactive Slider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize flex items-center justify-center z-10"
          style={{ left: sliderLeftPosition, transform: "translateX(-50%)" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Slider handle */}
          <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-base-300/20">
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
          </div>
        </div>

        {/* Instruction Text */}
        {showInstructionText && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-base-100/90 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-medium text-base-content/70 shadow-sm border border-base-100/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            Ziehe den Regler hin und her
          </motion.div>
        )}
      </motion.figure>
    );
  }
);

DiffSlider.displayName = "DiffSlider";

export default DiffSlider;
