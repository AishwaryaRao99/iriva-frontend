// src/components/AlertMessage.jsx

const variants = {
  info: {
    base: "border-blue-200 bg-blue-50 text-blue-900",
    icon: "ℹ️",
  },
  success: {
    base: "border-green-200 bg-green-50 text-green-900",
    icon: "✅",
  },
  error: {
    base: "border-red-200 bg-red-50 text-red-900",
    icon: "⚠️",
  },
};

export default function AlertMessage({ type = "info", title, message }) {
  const variant = variants[type] || variants.info;

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 shadow-sm ${variant.base}`} role="alert">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5">{variant.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base leading-tight mb-2">{title}</p>
          <p className="text-xs sm:text-sm leading-relaxed text-current">{message}</p>
        </div>
      </div>
    </div>
  );
}
