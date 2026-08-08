import { useState } from "react";
import { UserRound, KeyRound } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { candidateNav, recruiterNav, adminNav } from "../layouts/navConfig";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { updateProfile, changePassword } from "../services/authService";
import { validateName, validatePassword } from "../utils/validators";

const NAV_BY_ROLE = {
  candidate: candidateNav,
  recruiter: recruiterNav,
  admin: adminNav,
};

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user.name);
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleNameSubmit = async (e) => {
    e.preventDefault();

    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }

    setNameError("");
    setSavingName(true);
    try {
      const res = await updateProfile(name.trim());
      updateUser(res.data);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const error = validatePassword(passwords.next);
    if (error) {
      setPasswordError(error);
      return;
    }

    setPasswordError("");
    setSavingPassword(true);
    try {
      await changePassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "" });
      toast.success("Password updated.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout navItems={NAV_BY_ROLE[user.role]} title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold shrink-0">
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
            <Badge className="mt-1.5">{user.role}</Badge>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
            <UserRound size={16} /> Profile Details
          </h3>
          <p className="text-sm text-slate-500 mb-4">Update your display name.</p>

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              error={nameError}
            />
            <Button type="submit" loading={savingName}>
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
            <KeyRound size={16} /> Change Password
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Choose a new password for your account.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
            <Input
              label="New Password"
              type="password"
              value={passwords.next}
              onChange={(e) => {
                setPasswords({ ...passwords, next: e.target.value });
                if (passwordError) setPasswordError("");
              }}
              error={passwordError}
            />
            <Button type="submit" loading={savingPassword}>
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
