const TONES = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
};

// Maps common backend status/role strings to a sensible tone automatically.
const AUTO_TONE = {
  pending: "amber",
  shortlisted: "green",
  rejected: "red",
  active: "green",
  suspended: "red",
  candidate: "blue",
  recruiter: "purple",
  admin: "slate",
};

function Badge({ children, tone, className = "" }) {
  const resolvedTone =
    tone || AUTO_TONE[String(children).toLowerCase()] || "slate";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${TONES[resolvedTone]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
