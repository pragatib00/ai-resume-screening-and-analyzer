import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import FloatingBadge from "./FloatingBadge";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.25) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute top-40 -right-32 w-[26rem] h-[26rem] rounded-full bg-blue-50 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3.5 py-1.5">
            <Sparkles size={13} /> AI-Powered Recruitment
          </span>

          <h1 className="mt-6 text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1]">
            AI Resume Screening<br /> and Analyzer
          </h1>

          <p className="mt-6 text-xl text-slate-600 max-w-xl">
            Analyze resumes, match candidates, and make smarter hiring decisions
            with AI.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/20"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="text-slate-700 px-8 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition font-medium"
            >
              Log In
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck size={16} className="text-blue-600" />
            Free to get started &mdash; no credit card required.
          </div>
        </div>

        <div className="relative">
          <FloatingBadge
            icon={Sparkles}
            text="AI-Verified Match"
            tone="blue"
            className="absolute -top-6 -left-6 hidden sm:flex z-10"
          />

          <FloatingBadge
            icon={ShieldCheck}
            text="ATS Optimized"
            tone="green"
            className="absolute -bottom-6 -right-4 hidden sm:flex z-10"
          />

          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

export default Hero;
