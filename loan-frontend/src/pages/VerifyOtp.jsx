import { useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyOtp, sendOtp } from "../services/authService";
import {
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const CODE_LENGTH = 6;

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);

    if (cleaned && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.slice(0, CODE_LENGTH).split("");
    setDigits([...next, ...Array(CODE_LENGTH - next.length).fill("")]);
    inputsRef.current[Math.min(next.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setError("Enter the full 6-digit code");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(email, code);
      setMessage("Email verified. Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid or expired OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Enter your email first");
      return;
    }

    setResending(true);
    try {
      await sendOtp(email);
      setMessage("OTP resent. Check your inbox.");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Could not resend OTP";
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-visual">
        <div className="login-visual-grid"></div>

        <div className="login-visual-brand">
          <div className="rail-brand-mark">A</div>
          <h2>AutoDrive</h2>
        </div>

        <div className="login-visual-quote">
          <div className="odometer">OTP</div>
          <p>
            One last step. Enter the code we emailed you to activate your
            account.
          </p>
        </div>

        <div className="login-visual-foot">AUTO DRIVE LOAN MANAGEMENT</div>
      </div>

      <div className="login-form-side">
        <div className="login-form-box">
          <h1>Verify your email</h1>
          <p className="sub">Check your inbox for the 6-digit code</p>

          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {message && (
            <div className="otp-success">
              <CheckCircle2 size={16} />
              {message}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="field">
              <label>
                <Mail size={16} /> Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="field">
              <label>
                <ShieldCheck size={16} /> Enter code
              </label>
              <div className="otp-code-row" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              <ShieldCheck size={18} />
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <div className="otp-resend-row">
            <span>Didn't get a code?</span>
            <button
              type="button"
              className="otp-resend-btn"
              onClick={handleResend}
              disabled={resending}
            >
              <RefreshCw size={14} />
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <Link to="/" className="otp-back-link">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;