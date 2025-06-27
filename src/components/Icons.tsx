import React from "react";
import { motion } from "framer-motion";
import {
  CloudArrowUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  MagnifyingGlassPlusIcon,
  CogIcon,
  EyeIcon as HeroEyeIcon,
  PhotoIcon,
  UserIcon as HeroUserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon as HeroHeartIcon,
  CurrencyEuroIcon,
  MoonIcon as HeroMoonIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const UploadIcon = ({ isDragging }: { isDragging: boolean }) => (
  <motion.div
    animate={isDragging ? "dragging" : "initial"}
    variants={{
      initial: { scale: 1, y: 0 },
      dragging: {
        scale: 1.1,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      },
    }}
    aria-hidden="true"
  >
    <CloudArrowUpIcon className="size-12 sm:size-16 md:size-20 text-base-content/40" />
  </motion.div>
);

export const BackIcon = () => (
  <ArrowLeftIcon className="size-4 mt-0.5" title="Anderes Bild hochladen" />
);

export const ContinueIcon = () => (
  <ArrowRightIcon className="size-5" title="Vorschläge übernehmen" />
);

export const ResetIcon = () => (
  <ArrowPathIcon
    className="size-16 text-white/80"
    title="Aktion zurücksetzen"
  />
);

export const DownloadIcon = () => (
  <ArrowDownTrayIcon className="size-4" title="download" />
);

export const EditIcon = () => <PencilIcon className="size-4" title="edit" />;

export const StartOverIcon = () => (
  <ArrowPathIcon className="size-4" title="start over" />
);

export const EnlargeIcon = () => (
  <MagnifyingGlassPlusIcon className="size-4" title="enlarge" />
);

// Settings page icons
export const SettingsIcon = () => <CogIcon className="w-6 h-6 text-primary" />;

export const EyeIcon = () => <HeroEyeIcon className="w-5 h-5" />;

export const ImageIcon = () => <PhotoIcon className="w-5 h-5" />;

export const UploadIconSmall = () => <CloudArrowUpIcon className="w-5 h-5" />;

export const BackIconSmall = () => (
  <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
);

// Profile page tab icons
export const OverviewIcon = () => (
  <HeroUserIcon className="w-5 h-5" title="Übersicht" />
);

export const TransactionsIcon = () => (
  <ChartBarIcon className="w-5 h-5" title="Transaktionen" />
);

export const ImagesIcon = () => (
  <PhotoIcon className="w-5 h-5" title="Generierte Bilder" />
);

// MobileMenu icons
export const MenuIcon = ({ isOpen }: { isOpen: boolean }) => {
  const IconComponent = isOpen ? XMarkIcon : Bars3Icon;
  return <IconComponent className="w-5 h-5 text-base-content" />;
};

export const HeartIcon = () => (
  <HeroHeartIcon className="w-4 h-4 text-base-content/70" />
);

export const UserIcon = () => (
  <HeroUserIcon className="w-4 h-4 text-base-content/70" />
);

export const EuroIcon = () => (
  <CurrencyEuroIcon className="w-5 h-5 text-primary" />
);

export const SettingsIconSmall = () => (
  <CogIcon className="w-4 h-4 text-base-content/70" />
);

export const MoonIcon = () => (
  <HeroMoonIcon className="w-4 h-4 text-base-content/70" />
);

export const SignOutIcon = () => (
  <ArrowRightOnRectangleIcon className="w-4 h-4 text-error" />
);
