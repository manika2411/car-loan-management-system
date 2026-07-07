import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users2,
  UserPlus,
  FileText,
  Wallet,
  ShieldCheck,
  FolderCheck,
  Send,
  ClipboardList,
  Landmark,
  CalendarClock,
  CreditCard,
  Car,
  Users,
  LogOut,
} from "lucide-react";

function Navbar() {
  const role = localStorage.getItem("role");
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <aside className="rail">
      <div className="rail-brand">
        <div className="rail-brand-mark">A</div>
        <div className="rail-brand-name">AutoDrive</div>
      </div>
      <div className="rail-section-label">Navigation</div>
      <div className="rail-nav">
        <Link className="rail-link" to="/dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {(role === "ROLE_ADMIN" || role === "ROLE_SALES_AGENT") && (
        <>
          <Link className="rail-link" to="/leads">
            <Users2 size={18} />
            Leads
          </Link>

          <Link className="rail-link" to="/add-lead">
          <UserPlus size={18} />
          Add Lead
          </Link>
          </>
        )}

        {(role === "ROLE_ADMIN" || role === "ROLE_LOAN_OFFICER") && (
          <>
            <Link className="rail-link" to="/applications">
              <ClipboardList size={18} />
              Applications
            </Link>

            <Link className="rail-link" to="/loan-accounts">
              <Landmark size={18} />
              Loan Accounts
            </Link>

            <Link className="rail-link" to="/kyc-review">
              <FolderCheck size={18} />
              KYC Review
            </Link>
          </>
        )}

        {role === "ROLE_CUSTOMER" && (
          <>
            <Link className="rail-link" to="/documents">
              <FileText size={18} />
              KYC Documents
            </Link>

            <Link className="rail-link" to="/apply-loan">
              <Send size={18} />
              Apply Loan
            </Link>

            <Link className="rail-link" to="/my-applications">
              <ShieldCheck size={18} />
              My Applications
            </Link>

            <Link className="rail-link" to="/loan-account">
              <Wallet size={18} />
              Loan Account
            </Link>

            <Link className="rail-link" to="/emi-schedule">
              <CalendarClock size={18} />
              EMI Schedule
            </Link>

            <Link className="rail-link" to="/payments">
              <CreditCard size={18} />
              Payments
            </Link>
          </>
        )}

        {(role === "ROLE_ADMIN" || role === "ROLE_SALES_AGENT") && (
          <>
            
          </>
        )}

        {role === "ROLE_ADMIN" && (
          <>
            <Link className="rail-link" to="/vehicles">
              <Car size={18} />
              Vehicles
            </Link>

            <Link className="rail-link" to="/users">
              <Users size={18} />
              Users
            </Link>
          </>
        )}
      </div>

      <div className="rail-footer">
        <div className="rail-user">
          <div className="rail-user-avatar">A</div>
        </div>

        <button className="rail-logout" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Navbar;