import { useState, useEffect } from "react";

/**
 * Dismissible Alert Component
 * A customizable alert popup that can be closed with an X button
 * Props:
 * - type (error, warning, info, success)
 * - title
 * - message
 * - onDismiss (optional callback when closed)
 * - autoCloseMs (optional - auto close after milliseconds)
 */
export default function DismissibleAlert({ type = "error", title, message, onDismiss, autoCloseMs }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoCloseMs) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoCloseMs);

      return () => clearTimeout(timer);
    }
  }, [autoCloseMs]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const variants = {
    error: {
      base: "border-red-200 bg-red-50 text-red-900",
      closeBtn: "text-red-600 hover:text-red-800",
      icon: "⚠️",
    },
    warning: {
      base: "border-yellow-200 bg-yellow-50 text-yellow-900",
      closeBtn: "text-yellow-600 hover:text-yellow-800",
      icon: "⚠️",
    },
    info: {
      base: "border-blue-200 bg-blue-50 text-blue-900",
      closeBtn: "text-blue-600 hover:text-blue-800",
      icon: "ℹ️",
    },
    success: {
      base: "border-green-200 bg-green-50 text-green-900",
      closeBtn: "text-green-600 hover:text-green-800",
      icon: "✅",
    },
  };

  const variant = variants[type] || variants.error;

  return (
    <div className={`fixed top-4 right-4 max-w-md rounded-2xl border p-4 sm:p-5 shadow-lg ${variant.base} z-50`} role="alert">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5">{variant.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base leading-tight mb-2">{title}</p>
          <p className="text-xs sm:text-sm leading-relaxed text-current">{message}</p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close alert"
          className={`flex-shrink-0 text-lg font-bold ${variant.closeBtn} focus:outline-none hover:opacity-70`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
