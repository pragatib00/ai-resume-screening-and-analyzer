import { CheckCircle2, XCircle, Lightbulb, GraduationCap, Briefcase } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import ScoreRing from "../ui/ScoreRing";

function SectionBar({ label, value }) {
  const pct = Math.max(0, Math.min(100, value));
  const color = pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SkillList({ title, icon: Icon, items, tone }) {
  return (
    <div>
      <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
        <Icon size={15} /> {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">None</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <Badge key={item} tone={tone}>
              {item}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultsPanel({ result }) {
  if (!result) return null;

  const {
    ats_score,
    section_scores,
    matched_skills,
    missing_skills,
    matched_education,
    missing_education,
    suggestions,
    resume_information,
    job_information,
  } = result;

  return (
    <div className="space-y-5">
      <Card className="flex flex-col sm:flex-row items-center gap-8">
        <ScoreRing score={ats_score} size={140} />

        <div className="flex-1 w-full space-y-4">
          <SectionBar label="Skills Match" value={section_scores.skills} />
          <SectionBar label="Education Match" value={section_scores.education} />
          <SectionBar label="Experience Match" value={section_scores.experience} />
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card>
          <SkillList
            title="Matched Skills"
            icon={CheckCircle2}
            items={matched_skills}
            tone="green"
          />
        </Card>

        <Card>
          <SkillList
            title="Missing Skills"
            icon={XCircle}
            items={missing_skills}
            tone="red"
          />
        </Card>

        <Card>
          <SkillList
            title="Matched Education"
            icon={GraduationCap}
            items={matched_education}
            tone="green"
          />
        </Card>

        <Card>
          <SkillList
            title="Missing Education"
            icon={GraduationCap}
            items={missing_education}
            tone="red"
          />
        </Card>
      </div>

      {suggestions?.length > 0 && (
        <Card>
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-3">
            <Lightbulb size={15} /> Suggestions to Improve Your Resume
          </h4>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-3">
          <Briefcase size={15} /> Experience
        </h4>
        <p className="text-sm text-slate-600">
          Your resume shows{" "}
          <strong>{resume_information.experience_years}</strong> year(s) of
          experience, compared to{" "}
          <strong>{job_information.experience_years}</strong> year(s) required for
          this role.
        </p>
      </Card>
    </div>
  );
}

export default ResultsPanel;
