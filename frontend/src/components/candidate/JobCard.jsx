import { MapPin, Building2, CheckCircle2 } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function JobCard({ job, applied, onApply }) {
  const skills = (job.required_skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Card hoverable className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 truncate">
            {job.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Building2 size={14} /> {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {job.location}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600 line-clamp-3">{job.description}</p>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 6).map((skill) => (
            <Badge key={skill} tone="blue">
              {skill}
            </Badge>
          ))}
          {skills.length > 6 && <Badge tone="slate">+{skills.length - 6} more</Badge>}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-slate-100">
        {applied ? (
          <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium py-2.5">
            <CheckCircle2 size={16} /> Applied
          </div>
        ) : (
          <Button className="w-full" onClick={() => onApply(job)}>
            Apply Now
          </Button>
        )}
      </div>
    </Card>
  );
}

export default JobCard;
