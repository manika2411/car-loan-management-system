import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import {
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  UserPlus,
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
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
          <div className="odometer">JOIN</div>
          <p>
            Create your account and apply for vehicle loans, track applications,
            monitor EMIs and manage documents online.
          </p>
        </div>

        <div className="login-visual-foot">AUTO DRIVE LOAN MANAGEMENT</div>
      </div>

      <div className="login-form-side">
        <div className="login-form-box">
          <h1>Create Account</h1>
          <p className="sub">Get registered on AutoDrive</p>
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <form onSubmit={handleSignup}>
            <div className="field">
              <label>
                <User size={16} /> First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="field">
              <label>
                <User size={16} /> Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
            <div className="field">
              <label>
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="field">
              <label>
                <Phone size={16} /> Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="field">
              <label>
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="field">
              <label>
                <Lock size={16} /> Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
            <button type="submit" className="login-submit" disabled={loading}>
              <UserPlus size={18} />
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            Already have an account? <Link to="/">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;