import { useState } from "react";
import Navbar from "../components/Navbar";
import { getLoanAccountByAccountNumber } from "../services/loanAccountService";
import { Wallet, Search, Hash, Banknote, TrendingDown, Percent } from "lucide-react";

function LoanAccount() {
  const [accountNumber, setAccountNumber] = useState("");
  const [account, setAccount] = useState(null);
  const searchAccount = async () => {
    try {
      const data = await getLoanAccountByAccountNumber(accountNumber);
      setAccount(data);
    } catch (error) {
      console.error(error);
      alert("Loan account not found");
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <div className="content">
          <div className="page-header">
            <h1 className="page-title">
              <Wallet size={24} />
              Loan Account
            </h1>
          </div>

          <div className="panel">
            <div style={{ padding: "24px" }}>
              <label>
                <Hash size={16} /> Account Number
              </label>

              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="ACC-1781845545091"
              />

              <br />
              <br />

              <button className="btn btn-primary" onClick={searchAccount}>
                <Search size={16} />
                Search
              </button>
            </div>
          </div>

          {account && (
            <div
              className="stat-grid"
              style={{
                marginTop: "20px",
              }}
            >
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
          )}
        </div>
      </main>
    </div>
  );
}

export default LoanAccount;