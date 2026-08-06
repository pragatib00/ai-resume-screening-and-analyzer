import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

const VARIANTS = {
  error: {
    wrap: "bg-red-50 text-red-700 border-red-100",
    Icon: XCircle,
  },
  success: {
    wrap: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Icon: CheckCircle2,
  },
  warning: {
    wrap: "bg-amber-50 text-amber-700 border-amber-100",
    Icon: AlertTriangle,
  },
  info: {
    wrap: "bg-blue-50 text-blue-700 border-blue-100",
    Icon: Info,
  },
};

function Alert({ variant = "info", children, className = "" }) {
  const { wrap, Icon } = VARIANTS[variant];

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${wrap} ${className}`}
    >
      <Icon size={18} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

export default Alert;
