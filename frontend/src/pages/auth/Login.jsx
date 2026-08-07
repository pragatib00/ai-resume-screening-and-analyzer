import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Logo from "../../components/ui/Logo";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { validateEmail, validateRequired } from "../../utils/validators";

function Login() {
  const { login, roleHome } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {
      email: validateEmail(email),
      password: validateRequired(password, "Password"),
    };

    const cleaned = Object.fromEntries(
      Object.entries(errors).filter(([, v]) => v)
    );

    setFieldErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(roleHome[user.role] || "/");
    } catch (err) {
      const message = err.response?.data?.detail || "Invalid email or password.";
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
            Welcome back to Resume<span className="text-blue-200">IQ</span>
          </h1>
          <p className="mt-6 text-lg text-blue-100">
            Sign in to screen resumes, track applications, and let AI match
            the right candidates to the right roles.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Log in to continue to your dashboard.
            </p>

            {error && (
              <Alert variant="error" className="mt-6">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                error={fieldErrors.email}
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
                error={fieldErrors.password}
                placeholder="••••••••"
              />

              <Button type="submit" loading={loading} className="w-full mt-2">
                Log In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
