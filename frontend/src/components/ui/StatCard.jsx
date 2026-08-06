import Card from "./Card";

function StatCard({ icon: Icon, label, value, tone = "blue", trend }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card hoverable className="flex items-center gap-4">
      {Icon && (
        <div
          className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform ${tones[tone]}`}
        >
          <Icon size={22} />
        </div>
      )}

      <div className="min-w-0">
        <p className="text-sm text-slate-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>
        {trend && <p className="text-xs text-slate-400 mt-0.5">{trend}</p>}
      </div>
    </Card>
  );
}

export default StatCard;
