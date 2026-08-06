import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Briefcase, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Logo from "../../components/ui/Logo";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

const ROLES = [
  { value: "candidate", label: "Candidate", icon: UserRound },
  { value: "recruiter", label: "Recruiter", icon: Briefcase },
  { value: "admin", label: "Admin", icon: ShieldCheck },
];

function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    admin_secret: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(formData);

      if (formData.role === "recruiter") {
        setSuccess(
          "Account created. Recruiter accounts require admin approval before you can log in."
        );
        toast.success("Account created — pending admin approval.");
      } else {
        setSuccess("Account created successfully. Redirecting to login...");
        toast.success("Account created successfully!");
      }

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      const message = err.response?.data?.detail || "Registration failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/10" />

        <div className="relative max-w-md">
          <h1 className="text-5xl font-bold leading-tight">
            Join Resume<span className="text-blue-200">IQ</span>
          </h1>
          <p className="mt-6 text-lg text-blue-100">
            Whether you're hiring or job hunting, our AI-powered platform
            gets you to the right match faster.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Get started in less than a minute.
            </p>

            {error && (
              <Alert variant="error" className="mt-6">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mt-6">
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Full Name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  I am a
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(({ value, label, icon: Icon }) => {
                    const active = formData.role === value;
                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setFormData({ ...formData, role: value })}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition ${
                          active
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <Icon size={18} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.role === "recruiter" && (
                <Alert variant="info">
                  Recruiter accounts are reviewed by an admin before you can log in.
                </Alert>
              )}

              {formData.role === "admin" && (
                <Input
                  label="Admin Secret Key"
                  type="password"
                  name="admin_secret"
                  required
                  value={formData.admin_secret}
                  onChange={handleChange}
                  placeholder="Provided by the platform owner"
                />
              )}

              <Button type="submit" loading={loading} className="w-full mt-2">
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
