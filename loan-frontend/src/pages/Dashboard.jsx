import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllLeads } from "../services/leadService";
import {
  getAllApplications,
  getMyApplications,
} from "../services/applicationService";
import { getMyDocuments } from "../services/documentService";
import {
  LayoutDashboard,
  Users2,
  ClipboardList,
  CheckCircle2,
  FileText,
  FileCheck2,
  Wallet,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  SUBMITTED: "#8896A6",
  UNDER_REVIEW: "#D9A441",
  APPROVED: "#2F7D53",
  REJECTED: "#B4432F",
};

function buildStatusChartData(applications) {
  const counts = {};

  applications.forEach((app) => {
    counts[app.status] = (counts[app.status] || 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({
    name: status.replace("_", " "),
    status,
    value: count,
  }));
}

function Dashboard() {
  const role = localStorage.getItem("role");

  const [leadCount, setLeadCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [statusChartData, setStatusChartData] = useState([]);

  const [documentCount, setDocumentCount] = useState(0);
  const [customerApplicationCount, setCustomerApplicationCount] = useState(0);
  const [activeLoanCount, setActiveLoanCount] = useState(0);
  const [customerStatusChartData, setCustomerStatusChartData] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // ADMIN + SALES AGENT
        if (role === "ROLE_ADMIN" || role === "ROLE_SALES_AGENT") {
          const leads = await getAllLeads();

          setLeadCount(leads.length);
        }

        // ADMIN + LOAN OFFICER
        if (role === "ROLE_ADMIN" || role === "ROLE_LOAN_OFFICER") {
          const applications = await getAllApplications();

          setApplicationCount(applications.length);

          setApprovedCount(
            applications.filter((app) => app.status === "APPROVED").length
          );

          setStatusChartData(buildStatusChartData(applications));
        }

        // CUSTOMER
        if (role === "ROLE_CUSTOMER") {
          const documents = await getMyDocuments();

          setDocumentCount(documents.length);

          const applications = await getMyApplications();

          setCustomerApplicationCount(applications.length);

          setActiveLoanCount(
            applications.filter((app) => app.status === "APPROVED").length
          );

          setCustomerStatusChartData(buildStatusChartData(applications));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, [role]);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main">
        <div className="content">
          <h1 className="page-title">
            <LayoutDashboard size={26} />
            Dashboard
          </h1>

          <div className="stat-grid">
            {(role === "ROLE_ADMIN" || role === "ROLE_SALES_AGENT") && (
              <div className="stat-card">
                <div className="stat-label">
                  <Users2 size={16} />
                  Total Leads
                </div>

                <div className="stat-value">{leadCount}</div>
              </div>
            )}

            {(role === "ROLE_ADMIN" || role === "ROLE_LOAN_OFFICER") && (
              <>
                <div className="stat-card">
                  <div className="stat-label">
                    <ClipboardList size={16} />
                    Applications
                  </div>

                  <div className="stat-value">{applicationCount}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">
                    <CheckCircle2 size={16} />
                    Approved Loans
                  </div>

                  <div className="stat-value">{approvedCount}</div>
                </div>
              </>
            )}

            {role === "ROLE_CUSTOMER" && (
              <>
                <div className="stat-card">
                  <div className="stat-label">
                    <FileText size={16} />
                    KYC Documents
                  </div>
                  <div className="stat-value">{documentCount}</div>
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#666",
                    }}
                  >
                    Uploaded Documents
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">
                    <FileCheck2 size={16} />
                    Loan Applications
                  </div>
                  <div className="stat-value">{customerApplicationCount}</div>
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#666",
                    }}
                  >
                    Submitted Applications
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">
                    <Wallet size={16} />
                    Active Loans
                  </div>
                  <div className="stat-value">{activeLoanCount}</div>
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#666",
                    }}
                  >
                    Approved Applications
                  </div>
                </div>
              </>
            )}
          </div>

          {(role === "ROLE_ADMIN" || role === "ROLE_LOAN_OFFICER") &&
            statusChartData.length > 0 && (
              <div className="panel">
                <div className="panel-header">
                  <h3>
                    <PieChartIcon size={18} />
                    Applications by Status
                  </h3>
                  <span
                    style={{ fontSize: "13px", color: "var(--ink-soft)" }}
                  >
                    {applicationCount} total
                  </span>
                </div>
                <div style={{ padding: "24px", height: "360px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 30, right: 30, bottom: 10, left: 30 }}>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="48%"
                        outerRadius={85}
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {statusChartData.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={STATUS_COLORS[entry.status] || "#8896A6"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} applications`, name]}
                      />
                      <Legend
                        formatter={(value, entry) =>
                          `${value} (${entry.payload.value})`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          {role === "ROLE_CUSTOMER" && customerStatusChartData.length > 0 && (
            <div className="panel">
              <div className="panel-header">
                <h3>
                  <PieChartIcon size={18} />
                  My Applications by Status
                </h3>
                <span style={{ fontSize: "13px", color: "var(--ink-soft)" }}>
                  {customerApplicationCount} total
                </span>
              </div>
              <div style={{ padding: "24px", height: "360px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 30, right: 30, bottom: 10, left: 30 }}>
                    <Pie
                      data={customerStatusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      outerRadius={85}
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {customerStatusChartData.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={STATUS_COLORS[entry.status] || "#8896A6"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} applications`, name]}
                    />
                    <Legend
                      formatter={(value, entry) =>
                        `${value} (${entry.payload.value})`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;