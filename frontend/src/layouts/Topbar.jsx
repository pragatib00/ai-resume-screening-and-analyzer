import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, UserRound, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/ui/Badge";
import NotificationBell from "../components/common/NotificationBell";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfileMenu({ user, onLogoutClick }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-xl px-2 py-1 -mx-2 -my-1 hover:bg-slate-100 transition"
      >
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-slate-800 leading-tight">{user.name}</p>
          <Badge tone={undefined}>{user.role}</Badge>
        </div>

        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
          {initials(user.name)}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-40">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <UserRound size={16} /> View Profile
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onLogoutClick();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}

function Topbar({ title, onMenuClick, onLogoutClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white/80 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h1>
      </div>

      {user && (
        <div className="relative flex items-center gap-3">
          <NotificationBell role={user.role} />
          <ProfileMenu user={user} onLogoutClick={onLogoutClick} />
        </div>
      )}
    </header>
  );
}

export default Topbar;
