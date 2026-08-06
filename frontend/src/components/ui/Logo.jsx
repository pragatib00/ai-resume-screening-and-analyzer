import { FileText } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3">

      <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
        <FileText className="text-white" size={22} />
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight">
          Resume<span className="text-blue-600">IQ</span>
        </h1>

        <p className="text-xs text-slate-500">
          AI Resume Screening and Analyzer
        </p>
      </div>

    </div>
  );
}

export default Logo;