import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 disabled:bg-blue-300",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:text-slate-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20 disabled:bg-red-300",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 disabled:text-slate-300",
  outline:
    "bg-transparent text-blue-600 border border-blue-200 hover:bg-blue-50 disabled:text-blue-300",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
}

export default Button;
