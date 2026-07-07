import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getCurrentUser } from "../services/authService";
import { Mail, Lock, AlertCircle, LogIn } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const response = await login({
        email,
        password,
      });
      localStorage.setItem("token", response.token);
      const user = await getCurrentUser();
      localStorage.setItem("role", user.roles[0].authority);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-visual">
        <div className="login-visual-grid"></div>
        <div className="login-visual-brand">
          <div className="rail-brand-mark">A</div>
          <h2 className="black">AutoDrive</h2>
        </div>
        <div className="login-visual-quote">
          <div className="odometer">24/7</div>
          <p>
            Streamline vehicle loan processing, customer onboarding, approvals,
            payments and account management from a single platform.
          </p>
        </div>
        <div className="login-visual-foot">AUTO DRIVE LOAN MANAGEMENT</div>
      </div>
      <div className="login-form-side">
        <div className="login-form-box">
          <h1>Welcome Back</h1>
          <p className="sub">Sign in to continue</p>
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="field">
              <label>
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label>
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-submit">
              <LogIn size={18} />
                Sign In
            </button>
            <p style={{ marginTop: "20px", textAlign: "center" }}>
              Don't have an account? <Link to="/signup">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;