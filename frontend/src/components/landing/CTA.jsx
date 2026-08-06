import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
      <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative">
        <h2 className="text-4xl font-bold">
          Ready to Get Started?
        </h2>

        <p className="mt-4 text-blue-100">
          Experience AI-powered resume screening with ResumeIQ.
        </p>

        <Link
          to="/register"
          className="inline-block mt-8 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg shadow-blue-900/20"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}

export default CTA;
