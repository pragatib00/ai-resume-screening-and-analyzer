import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Lightbulb, ExternalLink } from "lucide-react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import Badge from "../ui/Badge";
import ScoreRing from "../ui/ScoreRing";
import Alert from "../ui/Alert";
import { fileUrl } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { getApplicantAnalysis } from "../../services/applicationService";

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

function AnalysisModal({ applicant, open, onClose, onAnalyzed }) {
  const toast = useToast();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !applicant) return;

    getApplicantAnalysis(applicant.id)
      .then((res) => {
        setAnalysis(res.data);
        onAnalyzed?.(applicant.id, res.data.ats_score);
      })
      .catch((err) => {
        const message = err.response?.data?.detail || "Failed to load analysis.";
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, applicant, toast]);

  if (!applicant) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${applicant.candidate.name}, Analysis`}
      size="lg"
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : analysis ? (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={analysis.ats_score} size={120} />

            <div className="flex-1 w-full space-y-3">
              <SectionBar label="Skills" value={analysis.section_scores.skills} />
              <SectionBar label="Education" value={analysis.section_scores.education} />
              <SectionBar label="Experience" value={analysis.section_scores.experience} />
            </div>
          </div>

          {analysis.scored_categories?.length > 0 && (
            <p className="text-xs text-slate-400">
              Scored on: {analysis.scored_categories.join(", ")}
            </p>
          )}

          {applicant.resume_path && (
            <a
              href={fileUrl(applicant.resume_path)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
            >
              View Resume <ExternalLink size={14} />
            </a>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            <SkillList
              title="Matched Skills"
              icon={CheckCircle2}
              items={analysis.matched_skills}
              tone="green"
            />
            <SkillList
              title="Missing Skills"
              icon={XCircle}
              items={analysis.missing_skills}
              tone="red"
            />
            <SkillList
              title="Matched Education"
              icon={CheckCircle2}
              items={analysis.matched_education}
              tone="green"
            />
            <SkillList
              title="Missing Education"
              icon={XCircle}
              items={analysis.missing_education}
              tone="red"
            />
          </div>

          {analysis.suggestions?.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                <Lightbulb size={15} /> Suggestions for the Candidate
              </h4>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
}

export default AnalysisModal;
