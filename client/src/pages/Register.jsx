import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    if (form.password.length === 0) return "";
    if (form.password.length < 6) return "Weak";
    if (form.password.length < 10 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) return "Good";
    return "Strong";
  }, [form.password]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, confirmPassword: undefined });
      showToast("Account created successfully. Welcome to The Spice Route.", "success");
      navigate("/restaurants", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form glass-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Join the Club</p>
        <h2>Create an Account</h2>
        <p className="muted">Sign up to reserve tables and order your favorite meals with complete peace of mind.</p>

        {error && <div className="alert-error">{error}</div>}

        <label>Full Name</label>
        <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Jane Doe" />

        <label>Email</label>
        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />

        <label>Phone Number</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />

        <label>Password</label>
        <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
        {form.password ? <p className="small muted">Password strength: {passwordStrength}</p> : null}

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />

        <label className="checkbox-inline">
          <input type="checkbox" required /> Agree to Terms & Conditions
        </label>

        <button type="submit" className="btn-primary full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <div className="social-row">
          <button type="button" className="social-btn">Google</button>
          <button type="button" className="social-btn">Facebook</button>
        </div>

        <p className="muted small center">
          Already have an account? <Link to="/login" className="text-link">Log in</Link>
        </p>
      </form>
    </div>
  );
}
