import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  reviewApplication,
} from "../services/applicationService";
import { getAiRecommendation } from "../services/aiService";
import {
  getDocumentsByApplication,
  downloadDocument,
} from "../services/documentService";
import {
  ClipboardList,
  Sparkles,
  CheckCircle2,
  XCircle,
  PlayCircle,
  FolderOpen,
  Download,
  Loader2,
  Search,
  Eye,
  User,
  Mail,
  Phone,
} from "lucide-react";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const aiPanelRef = useRef(null);
  const kycPanelRef = useRef(null);
  const detailsPanelRef = useRef(null);

  const loadApplications = async () => {
    try {
      const data = await getAllApplications();
      data.sort((a, b) => a.id - b.id);
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReview = async (id) => {
    try {
      await reviewApplication(id);
      loadApplications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewKyc = async (applicationId) => {
    try {
      const data = await getDocumentsByApplication(applicationId);
      setDocuments(data);
      setShowDocuments(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAiRecommendation = async (applicationId) => {
    try {
      setAiResult(null);
      setLoadingAi(true);
      const result = await getAiRecommendation(applicationId);
      setAiResult(result);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch AI recommendation.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleViewDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const data = await getApplicationById(id);
      setSelectedApplication(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load application details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setSelectedApplication(null);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getAllApplications();
        data.sort((a, b) => a.id - b.id);
        setApplications(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveApplication(id);

      loadApplications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectApplication(id);

      loadApplications();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const q = search.toLowerCase();
    const matchesSearch =
      app.vehicleName?.toLowerCase().includes(q) ||
      String(app.id).includes(q);
    const matchesStatus =
      statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (showDocuments) {
      kycPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showDocuments, documents]);

  useEffect(() => {
    if (loadingAi || aiResult) {
      aiPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loadingAi, aiResult]);

  useEffect(() => {
    if (selectedApplication) {
      detailsPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedApplication]);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main">
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <ClipboardList size={24} />
                Applications
              </h1>
              <p className="page-subtitle">Review loan requests</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <ClipboardList size={18} />
                Loan Applications
              </h3>
              <div style={{ display: "flex", gap: "10px" }}>
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
                    placeholder="Search by vehicle or ID..."
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
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "7px 10px",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "7px",
                    fontSize: "13.5px",
                  }}
                >
                  <option value="ALL">All Status</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vehicle</th>
                    <th>Loan Amount</th>
                    <th>EMI</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>#{app.id}</td>
                      <td>{app.vehicleName}</td>
                      <td>₹ {app.loanAmount}</td>
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
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleViewDetails(app.id)}
                          >
                            <Eye size={14} />
                            View
                          </button>

                          {app.status === "SUBMITTED" && (
                            <>
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleReview(app.id)}
                              >
                                <PlayCircle size={14} />
                                Start Review
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleViewKyc(app.id)}
                              >
                                <FolderOpen size={14} />
                                View KYC
                              </button>
                            </>
                          )}

                          {app.status === "UNDER_REVIEW" && (
                            <>
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleViewKyc(app.id)}
                              >
                                <FolderOpen size={14} />
                                View KYC
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleAiRecommendation(app.id)}
                              >
                                <Sparkles size={14} />
                                AI Recommendation
                              </button>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                }}
                              >
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleApprove(app.id)}
                                >
                                  <CheckCircle2 size={14} />
                                  Approve
                                </button>
                                <button
                                  className="btn btn-negative"
                                  onClick={() => handleReject(app.id)}
                                >
                                  <XCircle size={14} />
                                  Reject
                                </button>
                              </div>
                            </>
                          )}

                          {app.status === "APPROVED" && (
                            <span
                              style={{
                                fontSize: "12.5px",
                                color: "var(--ink-soft)",
                              }}
                            >
                              No further action
                            </span>
                          )}

                          {app.status === "REJECTED" && (
                            <span
                              style={{
                                fontSize: "12.5px",
                                color: "var(--ink-soft)",
                              }}
                            >
                              No further action
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredApplications.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                        }}
                      >
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {loadingAi && (
            <div className="panel" style={{ marginTop: "20px" }} ref={aiPanelRef}>
              <div className="panel-header">
                <h3>
                  <Sparkles size={18} />
                  AI Recommendation
                </h3>
              </div>

              <div style={{ padding: "24px" }}>
                <p>
                  <Loader2 size={16} /> Analyzing application...
                </p>
              </div>
            </div>
          )}
          {aiResult && !loadingAi && (
            <div className="panel" style={{ marginTop: "20px" }} ref={aiPanelRef}>
              <div className="panel-header">
                <h3>
                  <Sparkles size={18} />
                  AI Recommendation
                </h3>
              </div>
              <div style={{ padding: "24px", whiteSpace: "pre-wrap" }}>
                {aiResult.reason}
              </div>
            </div>
          )}

          {showDocuments && (
            <div className="panel" style={{ marginTop: "20px" }} ref={kycPanelRef}>
              <div className="panel-header">
                <h3>
                  <FolderOpen size={18} />
                  Customer KYC Documents
                </h3>
              </div>

              <div style={{ padding: "24px" }}>
                {documents.length === 0 ? (
                  <p>No documents uploaded.</p>
                ) : (
                  <table className="ledger">
                    <thead>
                      <tr>
                        <th>Document Type</th>
                        <th>File Name</th>
                        <th>Download</th>
                      </tr>
                    </thead>

                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>{doc.documentType}</td>
                          <td>{doc.originalFileName}</td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => downloadDocument(doc.id)}
                            >
                              <Download size={14} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {(selectedApplication || loadingDetails) && (
            <div
              className="panel"
              style={{ marginTop: "20px" }}
              ref={detailsPanelRef}
            >
              <div className="panel-header">
                <h3>
                  <Eye size={18} />
                  Application Details
                </h3>
                <button className="btn btn-ghost btn-sm" onClick={closeDetails}>
                  Close
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {loadingDetails ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <div
                      style={{
                        marginBottom: "20px",
                        padding: "16px 18px",
                        background: "var(--slate-tint)",
                        borderRadius: "10px",
                      }}
                    >
                      <h4
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        <User size={16} />
                        Applicant Information
                      </h4>

                      <p style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <User size={13} /> <strong>Name:</strong>{" "}
                        {selectedApplication.user
                          ? `${selectedApplication.user.firstName} ${selectedApplication.user.lastName}`
                          : `${selectedApplication.lead?.firstName || ""} ${
                              selectedApplication.lead?.lastName || ""
                            }`}
                      </p>

                      <p style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <Mail size={13} /> <strong>Email:</strong>{" "}
                        {selectedApplication.user?.email ||
                          selectedApplication.lead?.email}
                      </p>

                      <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Phone size={13} /> <strong>Phone:</strong>{" "}
                        {selectedApplication.user?.phone ||
                          selectedApplication.lead?.phone}
                      </p>
                    </div>

                    <div className="stat-grid">
                      <div className="stat-card">
                        <div className="stat-label">Application ID</div>
                        <div className="stat-value">
                          #{selectedApplication.id}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-label">Vehicle</div>
                        <div className="stat-value">
                          {selectedApplication.vehicleName}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-label">Vehicle Price</div>
                        <div className="stat-value">
                          ₹ {selectedApplication.vehiclePrice}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-label">Down Payment</div>
                        <div className="stat-value">
                          ₹ {selectedApplication.downPayment}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-label">Loan Amount</div>
                        <div className="stat-value">
                          ₹ {selectedApplication.loanAmount}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-label">Monthly EMI</div>
                        <div className="stat-value">
                          ₹ {selectedApplication.monthlyEmi}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-label">Interest Rate</div>
                        <div className="stat-value">
                          {selectedApplication.interestRate}%
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-label">Tenure</div>
                        <div className="stat-value">
                          {selectedApplication.tenureMonths} months
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-label">Status</div>
                        <div className="stat-value">
                          {selectedApplication.status}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Applications;