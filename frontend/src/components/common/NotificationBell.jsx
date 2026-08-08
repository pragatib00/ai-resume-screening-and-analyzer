import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, UserPlus, RefreshCcw, Mail } from "lucide-react";
import {
  getUnreadMessageCount,
  getContactMessages,
  markMessageRead,
} from "../../services/adminService";
import {
  getUnreadNotificationCount,
  getNotifications,
  markNotificationRead,
} from "../../services/notificationService";

const POLL_INTERVAL_MS = 30000;

const VIEW_ALL_PATH = {
  admin: "/admin/messages",
  recruiter: "/recruiter/applicants",
  candidate: "/candidate/applications",
};

const TYPE_ICON = {
  new_applicant: UserPlus,
  status_change: RefreshCcw,
};

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function NotificationBell({ role }) {
  const isAdmin = role === "admin";
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshUnreadCount = () => {
    const fetchCount = isAdmin ? getUnreadMessageCount : getUnreadNotificationCount;
    fetchCount()
      .then((res) => setUnreadCount(res.data.unread_count))
      .catch(() => {});
  };

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

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

  const handleToggle = () => {
    const next = !open;
    setOpen(next);

    if (next) {
      setLoading(true);
      const fetchItems = isAdmin
        ? () => getContactMessages().then((res) => res.data.slice(0, 5))
        : () => getNotifications(5).then((res) => res.data);

      fetchItems()
        .then((data) => setItems(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  };

  const handleSelectItem = async (item) => {
    setOpen(false);

    if (!item.is_read) {
      try {
        const markRead = isAdmin ? markMessageRead : markNotificationRead;
        await markRead(item.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // ignore, user can still view/retry from the full list
      }
    }

    navigate(isAdmin ? VIEW_ALL_PATH.admin : item.link || VIEW_ALL_PATH[role]);
  };

  const viewAllPath = VIEW_ALL_PATH[role] || "/";

  return (
    <div ref={containerRef}>
      <button
        onClick={handleToggle}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-40">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Notifications</p>
            {unreadCount > 0 && (
              <span className="text-xs text-slate-500">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">Loading...</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">
                No notifications yet.
              </p>
            ) : isAdmin ? (
              items.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectItem(m)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 text-sm font-medium text-slate-800 truncate flex items-center gap-1.5">
                      {!m.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{m.name}</span>
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">
                      {timeAgo(m.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{m.message}</p>
                </button>
              ))
            ) : (
              items.map((n) => {
                const Icon = TYPE_ICON[n.type] || Bell;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleSelectItem(n)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="min-w-0 flex items-start gap-1.5">
                        {!n.is_read && (
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        )}
                        <Icon size={14} className="mt-0.5 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-700 leading-snug">{n.message}</span>
                      </span>
                      <span className="text-xs text-slate-400 shrink-0">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <button
            onClick={() => {
              setOpen(false);
              navigate(viewAllPath);
            }}
            className="w-full px-4 py-2.5 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 border-t border-slate-100 transition-colors"
          >
            View all
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
