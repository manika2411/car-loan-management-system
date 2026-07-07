import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { uploadDocument, getMyDocuments } from "../services/documentService";
import { FileText, UploadCloud, FolderOpen } from "lucide-react";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("AADHAAR");
  const loadDocuments = async () => {
    try {
      const data = await getMyDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getMyDocuments();
        setDocuments(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Select a file");
      return;
    }

    try {
      await uploadDocument(documentType, file);
      setFile(null);
      loadDocuments();
      alert("Document uploaded successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <FileText size={24} />
                KYC Documents
              </h1>

              <p className="page-subtitle">
                Upload identity and income proof documents
              </p>
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">
                <FileText size={16} />
                Uploaded Documents
              </div>

              <div className="stat-value">{documents.length}</div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <UploadCloud size={18} />
                Upload Document
              </h3>
            </div>

            <div
              style={{
                padding: "24px",
              }}
            >
              <form onSubmit={handleUpload}>
                <div className="field">
                  <label>
                    <FileText size={16} /> Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="AADHAAR">Aadhaar</option>
                    <option value="PAN">PAN</option>
                    <option value="SALARY_SLIP">Salary Slip</option>
                    <option value="BANK_STATEMENT">Bank Statement</option>
                    <option value="VEHICLE_INVOICE">Vehicle Invoice</option>
                  </select>
                </div>

                <div className="field">
                  <label>
                    <UploadCloud size={16} /> Select File
                  </label>

                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>

                <button className="btn btn-primary" type="submit">
                  <UploadCloud size={16} />
                  Upload
                </button>
              </form>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <FolderOpen size={18} />
                Uploaded Files
              </h3>
            </div>

            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>File Name</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>#{doc.id}</td>
                      <td>
                        <span className="tag tag-positive">
                          <FileText size={14} />
                          {doc.documentType}
                        </span>
                      </td>
                      <td>{doc.originalFileName}</td>
                      <td>
                        {(doc.fileSize / 1024).toFixed(2)}
                        KB
                      </td>
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

export default Documents;