import { MapPin, Building2 } from "lucide-react";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";

function JobDetailsModal({ job, open, onClose, footer }) {
  if (!job) return null;

  const skills = (job.required_skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Modal open={open} onClose={onClose} title={job.title} size="lg">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Building2 size={15} /> {job.company}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={15} /> {job.location}
          </span>
        </div>

        {skills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <Badge key={skill} tone="blue">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">
            Job Description
          </h4>
          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </p>
        </div>

        {footer && <div className="pt-4 border-t border-slate-100">{footer}</div>}
      </div>
    </Modal>
  );
}

export default JobDetailsModal;
