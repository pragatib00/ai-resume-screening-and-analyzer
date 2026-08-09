import { useEffect, useState } from "react";
import { UploadCloud, FileText, ScanSearch, History } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { candidateNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import ResultsPanel from "../../components/candidate/ResultsPanel";
import { useToast } from "../../context/ToastContext";
import {
  analyzeResume,
  getResumeHistory,
  getResumeHistoryDetail,
} from "../../services/resumeService";

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function ResumeAnalyzer() {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [openingId, setOpeningId] = useState(null);

  const loadHistory = () => {
    getResumeHistory()
      .then((res) => setHistory(res.data))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  };

  useEffect(loadHistory, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !jobDescription.trim()) {
      setError("Please attach a resume and paste a job description.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await analyzeResume(file, jobDescription);
      setResult(res.data);
      toast.success("Resume analyzed successfully.");
      loadHistory();
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to analyze resume.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPastAnalysis = async (entry) => {
    if (!entry.has_details) {
      toast.error("Details for this analysis are no longer available.");
      return;
    }

    setOpeningId(entry.id);
    try {
      const res = await getResumeHistoryDetail(entry.id);
      setResult(res.data);
      setError("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to load this analysis.");
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <DashboardLayout navItems={candidateNav} title="Resume Analyzer">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ScanSearch size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Check your ATS score</h2>
              <p className="text-sm text-slate-500">
                Upload your resume and a job description to see how well you match.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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

            <Textarea
              label="Job Description"
              rows={7}
              placeholder="Paste the job description you're targeting..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <Button type="submit" loading={loading} className="w-full">
              Analyze Resume
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
            <History size={16} /> Past Analyses
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Click a past analysis to view its full results again.
          </p>

          {historyLoading ? (
            <div className="flex justify-center py-10">
              <Spinner size={24} />
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              icon={History}
              title="No past analyses"
              description="Analyses you run will show up here so you can revisit them anytime."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleOpenPastAnalysis(entry)}
                  disabled={openingId === entry.id}
                  className={`w-full flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 text-left transition ${
                    entry.has_details ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {formatDate(entry.created_at)}
                    </p>
                    {!entry.has_details && (
                      <p className="text-xs text-slate-400">Details unavailable</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {openingId === entry.id ? (
                      <Spinner size={16} />
                    ) : (
                      <Badge
                        tone={
                          entry.ats_score >= 75 ? "green" : entry.ats_score >= 50 ? "amber" : "red"
                        }
                      >
                        {Math.round(entry.ats_score)}%
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

      </div>

      <Modal
        open={!!result}
        onClose={() => setResult(null)}
        title="Analysis Results"
        size="xl"
      >
        {result && <ResultsPanel result={result} />}
      </Modal>
    </DashboardLayout>
  );
}

export default ResumeAnalyzer;
