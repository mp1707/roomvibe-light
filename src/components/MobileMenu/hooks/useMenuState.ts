import { useState, useEffect, useRef } from "react";

export interface ButtonPosition {
  top: number;
  right: number;
}

export const useMenuState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8, // 8px gap (mt-2)
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleMenu();
    }
  };

  const handleNavigationClick = () => {
    setIsOpen(false);
  };

  const handleAuthRedirect = () => {
    handleNavigationClick();
    window.location.href = "/auth/login";
  };

  // Handle click outside to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both the button and the menu content
      const isOutsideButton =
        menuRef.current && !menuRef.current.contains(target);
      const isOutsideMenuContent =
        menuContentRef.current && !menuContentRef.current.contains(target);

      if (isOutsideButton && isOutsideMenuContent) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return {
    isOpen,
    buttonPosition,
    menuRef,
    buttonRef,
    menuContentRef,
    handleToggleMenu,
    handleKeyDown,
    handleNavigationClick,
    handleAuthRedirect,
  };
};
