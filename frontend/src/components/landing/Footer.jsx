import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, FileText } from "lucide-react";

function FacebookIcon({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M13.5 22v-8.5h2.85l.43-3.31H13.5V8.05c0-.96.27-1.61 1.64-1.61h1.75V3.49C16.57 3.43 15.54 3.34 14.34 3.34c-2.5 0-4.21 1.53-4.21 4.33v2.52H7.27v3.31h2.86V22h3.37Z" />
    </svg>
  );
}

function TwitterIcon({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M18.9 3H21.7l-6.1 6.98L22.8 21h-5.63l-4.41-5.77L7.7 21H4.9l6.53-7.46L4 3h5.77l3.99 5.28L18.9 3Zm-.98 16.3h1.56L7.15 4.6H5.47l12.45 14.7Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92A1.96 1.96 0 0 0 5.25 3ZM20.44 21h.01v-6.98c0-3.42-.73-6.05-4.73-6.05-1.92 0-3.21 1.05-3.74 2.05h-.05V8.5H8.72V21h3.38v-6.19c0-1.63.31-3.21 2.33-3.21 1.99 0 2.02 1.86 2.02 3.31V21h3.99Z" />
    </svg>
  );
}

function InstagramIcon({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width={size} height={size} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.15" cy="6.85" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/#features", label: "Features" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/register", label: "Get Started" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/login", label: "Login" },
  { to: "/register", label: "Create Account" },
];

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
];

const CONTACT_EMAIL = "resumeiq.help@gmail.com";
const CONTACT_PHONE = "9749713834";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <FileText className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Resume<span className="text-blue-400">IQ</span>
            </h2>
          </div>

          <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
            AI-powered resume screening and analysis that helps recruiters
            hire faster and helps candidates land the right role.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-3">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-slate-400 hover:text-blue-400 transition"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Company
          </h3>
          <ul className="mt-4 space-y-3">
            {COMPANY_LINKS.map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-slate-400 hover:text-blue-400 transition"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Get in Touch
          </h3>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition"
              >
                <Mail size={16} className="mt-0.5 shrink-0" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={`tel:+977${CONTACT_PHONE}`}
                className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition"
              >
                <Phone size={16} className="mt-0.5 shrink-0" />
                +977 {CONTACT_PHONE}
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-slate-400">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              Kathmandu, Nepal
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {year} ResumeIQ. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            AI Resume Screening and Analyzer
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
