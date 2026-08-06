function FloatingBadge({ icon: Icon, text, tone = "blue", className = "" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div
      className={`flex items-center gap-2.5 bg-white rounded-full shadow-lg shadow-slate-900/10 pl-2.5 pr-4 py-2 border border-slate-100 ${className}`}
    >
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${tones[tone]}`}
      >
        <Icon size={14} />
      </span>
      <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}

export default FloatingBadge;
