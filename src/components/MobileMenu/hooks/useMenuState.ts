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

  /**
   * Calculates the absolute viewport position (top / right) of the menu trigger
   * button so the floating menu can be positioned correctly. Works both on
   * mobile and desktop by relying on getBoundingClientRect().
   */
  const updateButtonPosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    setButtonPosition({
      top: rect.bottom,
      right: Math.max(0, window.innerWidth - rect.right),
    });
  };

  const handleToggleMenu = () => {
    if (!isOpen) {
      // About to open: make sure we have an up-to-date button position
      updateButtonPosition();
    }
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleMenu();
    }
  };

  const handleNavigationClick = () => {
    setIsOpen(false);
    setButtonPosition(null); // Reset position when closing
  };

  const handleAuthRedirect = () => {
    handleNavigationClick();
    window.location.href = "/auth/login";
  };

  // Keep the menu correctly positioned on viewport resize/orientation changes
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => updateButtonPosition();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Handle click outside to close menu
  useEffect(() => {
    if (!isOpen) {
      setButtonPosition(null); // Clear position when menu is closed
      return;
    }

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
