import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiMoreVertical } from "react-icons/fi";

const ITEM_HEIGHT = 40;
const MENU_PADDING = 8;
const GAP = 4;

/** items: [{ label, icon, onClick, danger }] */
export default function OptionsMenu({ items, label = "Options" }) {
  const [position, setPosition] = useState(null); // null = closed
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const open = position !== null;

  const close = useCallback(() => setPosition(null), []);

  const toggle = (e) => {
    e.stopPropagation();
    if (open) {
      close();
      return;
    }
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = items.length * ITEM_HEIGHT + MENU_PADDING;
    const fitsBelow = rect.bottom + GAP + menuHeight <= window.innerHeight;

    setPosition({
      right: document.documentElement.clientWidth - rect.right,
      ...(fitsBelow
        ? { top: rect.bottom + GAP }
        : { bottom: window.innerHeight - rect.top + GAP }),
    });
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e) => {
      const insideMenu = menuRef.current?.contains(e.target);
      const onButton = buttonRef.current?.contains(e.target);
      if (!insideMenu && !onButton) close();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    menuRef.current?.querySelector("button")?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open, close]);

  const handleMenuKeyDown = (e) => {
    const buttons = Array.from(menuRef.current.querySelectorAll("button"));
    const index = buttons.indexOf(document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      buttons[(index + 1) % buttons.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      buttons[(index - 1 + buttons.length) % buttons.length].focus();
    } else if (e.key === "Tab") {
      e.preventDefault();
      close();
      buttonRef.current?.focus();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={toggle}
        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <FiMoreVertical size={18} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ position: "fixed", ...position }}
            // Portal events bubble through React parents (e.g. a clickable card).
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onKeyDown={handleMenuKeyDown}
            className="z-50 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            {items.map(({ label: itemLabel, icon: Icon, onClick, danger }) => (
              <button
                key={itemLabel}
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                  // Return focus first so a modal can restore it here when it closes.
                  buttonRef.current?.focus();
                  onClick();
                }}
                className={`flex h-10 w-full items-center gap-2.5 px-3.5 text-left text-sm transition ${danger
                  ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
              >
                {Icon && <Icon size={16} aria-hidden="true" />}
                {itemLabel}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
