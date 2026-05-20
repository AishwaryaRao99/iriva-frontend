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
    <div className={`rounded-2xl border p-4 shadow-sm ${variant.base}`} role="alert">
      <div className="flex items-start gap-3">
        <span className="text-xl">{variant.icon}</span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm leading-6 text-current">{message}</p>
        </div>
      </div>
    </div>
  );
}
