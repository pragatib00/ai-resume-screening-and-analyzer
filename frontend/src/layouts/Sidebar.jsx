import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../components/ui/Logo";

function Sidebar({ navItems, onLogoutClick }) {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-slate-100">
        <Logo />
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={onLogoutClick}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
