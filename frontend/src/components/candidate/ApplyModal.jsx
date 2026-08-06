import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import ScoreRing from "../ui/ScoreRing";
import { useToast } from "../../context/ToastContext";
import { applyToJob, uploadResume } from "../../services/applicationService";

function ApplyModal({ job, open, onClose, onApplied }) {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const reset = () => {
    setFile(null);
    setError("");
    setResult(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please attach your resume as a PDF.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const applicationRes = await applyToJob(job.id);
      const uploadRes = await uploadResume(applicationRes.data.id, file);
      setResult(uploadRes.data);
      toast.success(`Applied to ${job.title} successfully!`);
      onApplied?.();
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to submit your application.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Modal open={open} onClose={handleClose} title={`Apply to ${job.title}`}>
      {result ? (
        <div className="flex flex-col items-center text-center py-4">
          <ScoreRing score={result.match_score} label="Match Score" />
          <p className="mt-4 text-sm text-slate-600">
            Your application to <strong>{job.title}</strong> at {job.company} has
            been submitted successfully.
          </p>
          <Button className="mt-6" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-500">
            Upload your resume (PDF) to apply for this role at{" "}
            <span className="font-medium text-slate-700">{job.company}</span>. We'll
            instantly calculate your ATS match score.
          </p>

          {error && <Alert variant="error">{error}</Alert>}

          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-6 py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition text-center">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            {file ? (
              <>
                <FileText size={28} className="text-blue-600" />
                <span className="text-sm font-medium text-slate-700">{file.name}</span>
              </>
            ) : (
              <>
                <UploadCloud size={28} className="text-slate-400" />
                <span className="text-sm text-slate-500">
                  Click to select your resume (PDF only)
                </span>
              </>
            )}
          </label>

          <Button type="submit" loading={loading} className="w-full">
            Submit Application
          </Button>
        </form>
      )}
    </Modal>
  );
}

export default ApplyModal;
