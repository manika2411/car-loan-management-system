import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllLoanAccounts } from "../services/loanAccountService";
import { useNavigate } from "react-router-dom";
import { Landmark, Hash, Search } from "lucide-react";

function LoanAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await getAllLoanAccounts();
        const activeAccounts = data.filter((account) =>account.loanApplication?.status !== "REJECTED")
          .sort((a, b) => a.id - b.id);
        setAccounts(activeAccounts);
      } catch (error) {
        console.error(error);
      }
    };

    loadAccounts();
  }, []);

  const filteredAccounts = accounts.filter((account) =>
    account.accountNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main">
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <Landmark size={24} />
                Loan Accounts
              </h1>
              <p className="page-subtitle">Manage active loans</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <Landmark size={18} />
                Loan Accounts
              </h3>
              <div style={{ position: "relative" }}>
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ink-soft)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search account number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    padding: "7px 10px 7px 32px",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "7px",
                    fontSize: "13.5px",
                    width: "220px",
                  }}
                />
              </div>
            </div>

            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account Number</th>
                    <th>Principal</th>
                    <th>Outstanding</th>
                    <th>Interest Rate</th>
                    <th>Tenure</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => (
                      <tr key={account.id}>
                        <td>#{account.id}</td>
                        <td>
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              navigate(`/loan-statement/${account.id}`)
                            }
                          >
                            <Hash size={14} />
                            {account.accountNumber}
                          </button>
                        </td>
                        <td>₹ {account.principalAmount?.toLocaleString()}</td>
                        <td>₹ {account.outstandingAmount?.toLocaleString()}</td>
                        <td>{account.interestRate}%</td>
                        <td>{account.tenureMonths} Months</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                        }}
                      >
                        No loan accounts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoanAccounts;