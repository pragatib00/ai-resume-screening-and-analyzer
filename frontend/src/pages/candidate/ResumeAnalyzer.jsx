import { useState } from "react";
import { UploadCloud, FileText, ScanSearch } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { candidateNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import ResultsPanel from "../../components/candidate/ResultsPanel";
import { useToast } from "../../context/ToastContext";
import { analyzeResume } from "../../services/resumeService";

function ResumeAnalyzer() {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to analyze resume.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
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

        {result && <ResultsPanel result={result} />}
      </div>
    </DashboardLayout>
  );
}

export default ResumeAnalyzer;
