import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/#features", label: "Features" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const { user, roleHome } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/" && !location.hash;
    if (to.startsWith("/#")) return false;
    return location.pathname === to;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              className={`text-sm font-medium transition ${
                isActive(to)
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex gap-4 items-center">
          {user ? (
            <Link
              to={roleHome[user.role] || "/"}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm shadow-blue-600/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm shadow-blue-600/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2 text-slate-700 hover:text-blue-600 transition"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-5 space-y-4">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className={`block text-sm font-medium ${
                isActive(to) ? "text-blue-600" : "text-slate-600"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {user ? (
              <Link
                to={roleHome[user.role] || "/"}
                onClick={() => setOpen(false)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-center font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-slate-600 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-center font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
