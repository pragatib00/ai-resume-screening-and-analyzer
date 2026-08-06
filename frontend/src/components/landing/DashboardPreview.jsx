import { Search, Bell, TrendingUp, Users, Briefcase } from "lucide-react";

const CANDIDATES = [
  { name: "Sarah Chen", score: 94 },
  { name: "Michael Brooks", score: 87 },
  { name: "Priya Patel", score: 76 },
];

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

function scoreTone(score) {
  if (score >= 85) return { bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 70) return { bar: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" };
  return { bar: "bg-red-500", text: "text-red-600", bg: "bg-red-50" };
}

function DashboardPreview({ className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 shadow-2xl shadow-blue-900/10 bg-white overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />

        <div className="ml-3 flex-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-400">
          <Search size={11} />
          app.resumeiq.com/recruiter
        </div>

        <Bell size={14} className="text-slate-300" />
      </div>

      <div className="p-5 sm:p-6 bg-gradient-to-b from-white to-slate-50">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-medium text-slate-400">
              Senior Frontend Engineer
            </p>
            <h4 className="text-base font-semibold text-slate-900">
              Top Candidates
            </h4>
          </div>
          <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
            Ranked by AI match
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: Users, label: "Applicants", value: "42" },
            { icon: Briefcase, label: "Open Roles", value: "6" },
            { icon: TrendingUp, label: "Avg. Match", value: "81%" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-100 bg-white p-3"
            >
              <Icon size={14} className="text-blue-600 mb-1.5" />
              <p className="text-lg font-bold text-slate-900 leading-none">
                {value}
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          {CANDIDATES.map((c) => {
            const tone = scoreTone(c.score);
            return (
              <div
                key={c.name}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {initials(c.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {c.name}
                  </p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${tone.bar}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${tone.bg} ${tone.text}`}
                >
                  {c.score}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;
