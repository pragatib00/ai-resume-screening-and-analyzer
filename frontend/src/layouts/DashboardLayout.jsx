import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Logo from "../components/ui/Logo";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DashboardFooter from "../components/common/DashboardFooter";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function MobileSidebar({ open, onClose, navItems }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />

      <div className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col shadow-2xl">
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" onClick={onClose}>
            <Logo />
          </Link>
          <button onClick={onClose} className="text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

function DashboardLayout({ navItems, title, children }) {
  const { logout } = useAuth();
  const toast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    logout();
    setConfirmLogout(false);
    setMobileOpen(false);
    toast.success("You have been logged out.");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar navItems={navItems} />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title={title}
          onMenuClick={() => setMobileOpen(true)}
          onLogoutClick={() => setConfirmLogout(true)}
        />

        <main
          className="flex-1 p-4 sm:p-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            backgroundColor: "#F8FAFC",
          }}
        >
          {children}
        </main>

        <DashboardFooter />
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        variant="default"
        title="Log out?"
        message="You'll need to log in again to access your dashboard."
        confirmLabel="Log Out"
      />
    </div>
  );
}

export default DashboardLayout;
