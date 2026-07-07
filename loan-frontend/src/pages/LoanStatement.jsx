import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getLoanAccount } from "../services/loanAccountService";
import { getEmiSchedule } from "../services/emiService";
import {
  FileText,
  User,
  Mail,
  Phone,
  Hash,
  Banknote,
  TrendingDown,
  Percent,
  ListChecks,
  Car,
} from "lucide-react";

function LoanStatement() {
  const { loanAccountId } = useParams();

  const [account, setAccount] = useState(null);
  const [emis, setEmis] = useState([]);

  useEffect(() => {
    const loadStatement = async () => {
      try {
        const accountData = await getLoanAccount(loanAccountId);
        console.log(JSON.stringify(accountData.loanApplication, null, 2));
        setAccount(accountData);
        const schedule = await getEmiSchedule(loanAccountId);
        setEmis(schedule);
      } catch (error) {
        console.error(error);
      }
    };

    loadStatement();
  }, [loanAccountId]);

  if (!account) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="main">
          <div className="content">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <div className="content">
          <h1 className="page-title">
            <FileText size={24} />
            Loan Statement
          </h1>
          <div className="panel">
            <div className="panel-header">
              <h3>
                <User size={18} />
                Customer Information
              </h3>
            </div>
            <div style={{ padding: "20px" }}>
              <p>
                <User size={14} /> <strong>Name:</strong>{" "}
                {account?.loanApplication?.user
                  ? `${account.loanApplication.user.firstName} ${account.loanApplication.user.lastName}`
                  : `${account?.loanApplication?.lead?.firstName || ""} ${
                      account?.loanApplication?.lead?.lastName || ""
                    }`}
              </p>

              <p>
                <Mail size={14} /> <strong>Email:</strong>{" "}
                {account?.loanApplication?.user?.email ||
                  account?.loanApplication?.lead?.email}
              </p>

              <p>
                <Phone size={14} /> <strong>Phone:</strong>{" "}
                {account?.loanApplication?.user?.phone ||
                  account?.loanApplication?.lead?.phone}
              </p>

              <p>
                <Car size={14} /> <strong>Vehicle:</strong>{" "}
                {account?.loanApplication?.vehicleName}
              </p>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">
                <Hash size={16} />
                Account Number
              </div>

              <div className="stat-value">{account.accountNumber}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                <Banknote size={16} />
                Principal
              </div>

              <div className="stat-value">₹ {account.principalAmount}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                <TrendingDown size={16} />
                Outstanding
              </div>

              <div className="stat-value">₹ {account.outstandingAmount}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                <Percent size={16} />
                Interest Rate
              </div>

              <div className="stat-value">{account.interestRate}%</div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: "20px" }}>
            <div className="panel-header">
              <ListChecks size={18} style={{ marginRight: "6px", verticalAlign: "middle" }} />
              EMI Schedule
            </div>

            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Due Date</th>
                    <th>EMI</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {emis.map((emi) => (
                    <tr key={emi.id}>
                      <td>{emi.installmentNumber}</td>
                      <td>{emi.dueDate}</td>
                      <td>₹ {emi.emiAmount}</td>
                      <td>₹ {emi.principalComponent}</td>
                      <td>₹ {emi.interestComponent}</td>
                      <td>₹ {emi.balanceAmount}</td>
                      <td>{emi.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoanStatement;