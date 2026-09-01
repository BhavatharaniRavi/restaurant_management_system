import { useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValid = useMemo(() => /.+@.+\..+/.test(form.email) && form.password.length >= 1, [form.email, form.password]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValid) {
      setError("Please enter a valid email and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirectTo = location.state?.from || (user.role === "admin" ? "/admin" : "/restaurants");
      showToast("Welcome back! Your account is ready.", "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-illustration" />
      <form className="auth-form glass-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome</p>
        <h2>Login</h2>
        <p className="muted">Access your account to order food and manage reservations.</p>

        {error && <div className="alert-error">{error}</div>}

        <label>Email Address</label>
        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />

        <label>Password</label>
        <div className="password-field">
          <input type={showPassword ? "text" : "password"} name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
          <button type="button" className="icon-btn small" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="auth-row">
          <label className="checkbox-inline">
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/register" className="text-link">Create account</Link>
        </div>

        <button type="submit" className="btn-primary full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
