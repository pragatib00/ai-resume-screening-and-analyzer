import { Link } from "react-router-dom";
import { Target, Sparkles, ShieldCheck, Users } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/landing/Footer";

const VALUES = [
  {
    icon: Sparkles,
    title: "AI-First",
    description:
      "We build tools that use AI to remove guesswork from hiring and job hunting alike.",
  },
  {
    icon: Target,
    title: "Fair Matching",
    description:
      "Every score is explainable — candidates and recruiters see exactly why a match works.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Privacy",
    description:
      "Resumes and personal data are handled securely and never shared without consent.",
  },
  {
    icon: Users,
    title: "People First",
    description:
      "Behind every resume is a person — our goal is to get them in front of the right opportunity.",
  },
];

const TEAM = [
  { name: "Orisha Shakya" },
  { name: "Pragati Basnet" },
  { name: "Pragati Lama" },
];

function initials(name) {
  return name.split(" ").map((p) => p[0]).join("");
}

function About() {
  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
        <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-blue-100 text-xs font-semibold px-3.5 py-1.5">
            About ResumeIQ
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight">
            Smarter hiring, powered by AI
          </h1>
          <p className="mt-5 text-lg text-blue-100 max-w-2xl mx-auto">
            ResumeIQ helps recruiters screen candidates faster and helps job
            seekers understand exactly how well their resume fits a role —
            using AI-driven analysis instead of guesswork.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Traditional resume screening is slow, inconsistent and easy to
              get wrong. We built ResumeIQ to give recruiters an AI-powered
              second opinion — one that reads every resume the same way,
              every time — and to give candidates clear, actionable feedback
              on how to improve their chances.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              What started as a small project has grown into a full
              platform: resume analysis, ATS scoring, candidate ranking and
              a recruiter dashboard that turns raw applications into
              decisions.
            </p>
            <Link
              to="/register"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-lg transition"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Meet the Team</h2>
          <p className="mt-3 text-slate-500">
            The people building and maintaining ResumeIQ.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {TEAM.map(({ name, role }) => (
              <div
                key={name}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
                  {initials(name)}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{name}</h3>
                <p className="mt-1 text-sm text-slate-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;
