import { useEffect, useMemo, useState } from "react";
import { Users as UsersIcon, Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { adminNav } from "../../layouts/navConfig";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "../../services/adminService";

const ASSIGNABLE_ROLES = ["candidate", "recruiter"];

const ROLE_FILTERS = [
  { value: "all", label: "All" },
  { value: "candidate", label: "Candidates" },
  { value: "recruiter", label: "Recruiters" },
  { value: "admin", label: "Admins" },
];

function Users() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");

  const roleCounts = useMemo(() => {
    const counts = { all: users.length, candidate: 0, recruiter: 0, admin: 0 };
    for (const u of users) counts[u.role] = (counts[u.role] || 0) + 1;
    return counts;
  }, [users]);

  const filteredUsers = useMemo(
    () => (roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter)),
    [users, roleFilter]
  );

  const load = () => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load users.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const patch = (id, updater) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updater } : u)));

  const handleActivate = async (u) => {
    setBusyId(u.id);
    try {
      await updateUserStatus(u.id, "active");
      patch(u.id, { status: "active" });
      toast.success(`${u.name} is now active.`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update status.");
    } finally {
      setBusyId(null);
    }
  };

  const runConfirmedAction = async () => {
    const { type, user: u, newRole } = confirmAction;
    setConfirmBusy(true);

    try {
      if (type === "suspend") {
        await updateUserStatus(u.id, "suspended");
        patch(u.id, { status: "suspended" });
        toast.success(`${u.name} has been suspended.`);
      } else if (type === "delete") {
        await deleteUser(u.id);
        setUsers((prev) => prev.filter((x) => x.id !== u.id));
        toast.success(`${u.name}'s account was deleted.`);
      } else if (type === "role") {
        await updateUserRole(u.id, newRole);
        patch(u.id, { role: newRole });
        toast.success(`${u.name} is now a ${newRole}.`);
      }
      setConfirmAction(null);
    } catch (err) {
      toast.error(
        err.response?.data?.detail || `Failed to update ${u.name}'s account.`
      );
    } finally {
      setConfirmBusy(false);
    }
  };

  return (
    <DashboardLayout navItems={adminNav} title="Users">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-5">
          {ROLE_FILTERS.map(({ value, label }) => {
            const active = roleFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRoleFilter(value)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {label}
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 ${
                    active ? "bg-white/20" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {roleCounts[value] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <EmptyState
              icon={UsersIcon}
              title="No users found"
              description={
                roleFilter !== "all"
                  ? `No ${roleFilter}s match this filter.`
                  : undefined
              }
            />
          </Card>
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="px-6 py-3.5 font-medium">Name</th>
                    <th className="px-6 py-3.5 font-medium">Email</th>
                    <th className="px-6 py-3.5 font-medium">Role</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                    <th className="px-6 py-3.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser.id;
                    const busy = busyId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-slate-800">
                          {u.name}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
                        <td className="px-6 py-3.5">
                          {u.role === "admin" ? (
                            <Badge>{u.role}</Badge>
                          ) : (
                            <Select
                              value={u.role}
                              disabled={busy}
                              onChange={(e) =>
                                setConfirmAction({
                                  type: "role",
                                  user: u,
                                  newRole: e.target.value,
                                })
                              }
                              className="!py-1.5 !w-32"
                            >
                              {ASSIGNABLE_ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </Select>
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          <Badge>{u.status}</Badge>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex justify-end items-center gap-2">
                            {u.status !== "suspended" && u.role !== "admin" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                icon={ShieldOff}
                                onClick={() => setConfirmAction({ type: "suspend", user: u })}
                              >
                                Suspend
                              </Button>
                            )}

                            {u.status !== "active" && u.role !== "admin" && (
                              <Button
                                size="sm"
                                variant="outline"
                                icon={ShieldCheck}
                                loading={busy}
                                onClick={() => handleActivate(u)}
                              >
                                {u.status === "pending" ? "Approve" : "Activate"}
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="danger"
                              icon={Trash2}
                              disabled={isSelf}
                              onClick={() => setConfirmAction({ type: "delete", user: u })}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={runConfirmedAction}
        loading={confirmBusy}
        variant={confirmAction?.type === "role" ? "default" : "danger"}
        title={
          confirmAction?.type === "suspend"
            ? "Suspend this account?"
            : confirmAction?.type === "role"
            ? "Change this user's role?"
            : "Delete this account?"
        }
        message={
          confirmAction &&
          (confirmAction.type === "suspend"
            ? `${confirmAction.user.name} will immediately lose access until reactivated.`
            : confirmAction.type === "role"
            ? `${confirmAction.user.name}'s role will change from "${confirmAction.user.role}" to "${confirmAction.newRole}". They may gain or lose access to parts of the platform.`
            : `${confirmAction.user.name}'s account and all associated data will be permanently deleted. This cannot be undone.`)
        }
        confirmLabel={
          confirmAction?.type === "suspend"
            ? "Suspend"
            : confirmAction?.type === "role"
            ? "Change Role"
            : "Delete Account"
        }
      />
    </DashboardLayout>
  );
}

export default Users;
