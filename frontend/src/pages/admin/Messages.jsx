import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { adminNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { getContactMessages, markMessageRead } from "../../services/adminService";

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function Messages() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    getContactMessages()
      .then((res) => setMessages(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load messages.")
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const handleMarkRead = async (message) => {
    setBusyId(message.id);
    try {
      await markMessageRead(message.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m))
      );
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update message.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout navItems={adminNav} title="Messages">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : messages.length === 0 ? (
          <Card>
            <EmptyState
              icon={Mail}
              title="No messages yet"
              description="Messages submitted through the Contact page will show up here."
            />
          </Card>
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="divide-y divide-slate-100">
              {messages.map((m) => (
                <div key={m.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      {!m.is_read && <Badge tone="blue">New</Badge>}
                      <span className="font-medium text-slate-800 truncate">{m.name}</span>
                      <span className="text-sm text-slate-500 truncate">{m.email}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-400">{formatDate(m.created_at)}</span>
                      {!m.is_read && (
                        <Button
                          size="sm"
                          variant="outline"
                          loading={busyId === m.id}
                          onClick={() => handleMarkRead(m)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 break-words">{m.message}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Messages;
