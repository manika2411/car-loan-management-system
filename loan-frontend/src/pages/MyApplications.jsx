import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMyApplications } from "../services/applicationService";
import { getLoanAccountByApplication } from "../services/loanAccountService";
import { FileCheck2, ClipboardList } from "lucide-react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const apps = await getMyApplications();
        console.log("Applications from API:", apps);
        const updatedApps = await Promise.all(
          apps.map(async (app) => {
            if (app.status !== "APPROVED") {
              return app;
            }

            try {
              const account = await getLoanAccountByApplication(app.id);
              return {
                ...app,
                accountNumber: account.accountNumber,
              };
            } catch {
              return {
                ...app,
                accountNumber: "Not Created",
              };
            }
          })
        );

        console.log("Updated Applications:", updatedApps);

        setApplications(updatedApps);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <FileCheck2 size={24} />
                My Applications
              </h1>
              <p className="page-subtitle">Track your loan applications</p>
            </div>
          </div>

          {loading ? (
            <div className="panel">
              <div style={{ padding: "24px" }}>Loading...</div>
            </div>
          ) : applications.length === 0 ? (
            <div className="panel">
              <div style={{ padding: "24px" }}>No applications found.</div>
            </div>
          ) : (
            <div className="panel">
              <div className="panel-header">
                <h3>
                  <ClipboardList size={18} />
                  Applications
                </h3>
              </div>

              <div className="table-wrap">
                <table className="ledger">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vehicle</th>
                      <th>Loan Amount</th>
                      <th>Loan Account</th>
                      <th>EMI</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td>#{app.id}</td>
                        <td>{app.vehicleName}</td>
                        <td>₹ {app.loanAmount}</td>
                        <td>{app.accountNumber || "-"}</td>
                        <td>₹ {app.monthlyEmi}</td>
                        <td>
                          <span
                            className={
                              app.status === "APPROVED"
                                ? "tag tag-positive"
                                : app.status === "REJECTED"
                                ? "tag tag-negative"
                                : app.status === "UNDER_REVIEW"
                                ? "tag tag-progress"
                                : "tag tag-new"
                            }
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyApplications;