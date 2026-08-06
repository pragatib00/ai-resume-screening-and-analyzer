import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/ui/Badge";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Topbar({ title, onMenuClick }) {
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
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-800 leading-tight">
              {user.name}
            </p>
            <Badge tone={undefined}>{user.role}</Badge>
          </div>

          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {initials(user.name)}
          </div>
        </div>
      )}
    </header>
  );
}

export default Topbar;
