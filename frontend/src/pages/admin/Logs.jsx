import { useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { adminNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { getLogs } from "../../services/adminService";

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function Logs() {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogs(50)
      .then((res) => setLogs(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load logs.")
      )
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <DashboardLayout navItems={adminNav} title="Error Logs">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : logs.length === 0 ? (
          <Card>
            <EmptyState
              icon={ScrollText}
              title="No errors logged"
              description="Nothing to see here, the system has been running smoothly."
            />
          </Card>
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div key={log.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <Badge tone="red">{log.source}</Badge>
                    <span className="text-xs text-slate-400 shrink-0">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 break-words">{log.message}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Logs;
