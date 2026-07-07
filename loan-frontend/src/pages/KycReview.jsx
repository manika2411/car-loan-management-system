import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllDocuments, downloadDocument } from "../services/documentService";
import { FolderCheck, FileText, Eye } from "lucide-react";

function KycReview() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await getAllDocuments();
        setDocuments(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDocuments();
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <FolderCheck size={24} />
                KYC Review
              </h1>
              <p className="page-subtitle">
                Review uploaded customer documents
              </p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <FileText size={18} />
                Documents
              </h3>
            </div>

            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Document Type</th>
                    <th>File Name</th>
                    <th>Uploaded At</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>#{doc.id}</td>
                      <td>
                        {doc.user?.firstName} {doc.user?.lastName}
                      </td>
                      <td>{doc.documentType}</td>
                      <td>{doc.originalFileName}</td>
                      <td>{doc.uploadedAt?.replace("T", " ")}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={async () => {
                            await downloadDocument(doc.id);
                          }}
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {documents.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                        }}
                      >
                        No documents found
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

export default KycReview;