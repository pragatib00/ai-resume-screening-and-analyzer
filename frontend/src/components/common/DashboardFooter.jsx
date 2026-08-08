import { Link } from "react-router-dom";
import { FileText, Mail, Phone } from "lucide-react";

const CONTACT_EMAIL = "resumeiq.help@gmail.com";
const CONTACT_PHONE = "9749713834";

function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white px-4 sm:px-8 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <FileText className="text-white" size={16} />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Resume<span className="text-blue-600">IQ</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-800 transition">
            Home
          </Link>
          <Link to="/#features" className="hover:text-slate-800 transition">
            Features
          </Link>
          <Link to="/#how-it-works" className="hover:text-slate-800 transition">
            How It Works
          </Link>
          <Link to="/about" className="hover:text-slate-800 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-slate-800 transition">
            Contact
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-1.5 hover:text-slate-800 transition"
          >
            <Mail size={14} /> {CONTACT_EMAIL}
          </a>
          <a
            href={`tel:+977${CONTACT_PHONE}`}
            className="flex items-center gap-1.5 hover:text-slate-800 transition"
          >
            <Phone size={14} /> +977 {CONTACT_PHONE}
          </a>
        </div>
      </div>

      <p className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center sm:text-left">
        &copy; {year} ResumeIQ. All rights reserved.
      </p>
    </footer>
  );
}

export default DashboardFooter;
