import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllLeads,
  updateLeadStatus,
  getLeadById,
  deleteLead,
} from "../services/leadService";
import { getLeadNotes, createLeadNote } from "../services/leadNoteService";
import {
  Users2,
  GitBranch,
  Search,
  MessageSquare,
  Send,
  Clock,
  Trash2,
} from "lucide-react";

function Leads() {
  const role = localStorage.getItem("role");
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  const [activeLead, setActiveLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const notesPanelRef = useRef(null);

  const handleStatusChange = async (leadId, status) => {
    try {
      await updateLeadStatus(leadId, status);

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                status,
              }
            : lead
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenNotes = async (lead) => {
    setActiveLead(lead);
    setNoteText("");
    setLoadingNotes(true);

    try {
      // pull the authoritative record rather than trusting the
      // possibly-stale row data already in the table
      const freshLead = await getLeadById(lead.id);
      setActiveLead(freshLead);

      const data = await getLeadNotes(lead.id);
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotes(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load notes");
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleDeleteLead = async (lead) => {
    if (
      !window.confirm(
        `Delete lead "${lead.firstName} ${lead.lastName}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteLead(lead.id);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));

      if (activeLead?.id === lead.id) {
        closeNotes();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete lead");
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      setSavingNote(true);
      const created = await createLeadNote(activeLead.id, noteText.trim());
      setNotes((prev) => [created, ...prev]);
      setNoteText("");
    } catch (error) {
      console.error(error);
      alert("Failed to add note");
    } finally {
      setSavingNote(false);
    }
  };

  const closeNotes = () => {
    setActiveLead(null);
    setNotes([]);
    setNoteText("");
  };

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await getAllLeads();

        setLeads(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadLeads();
  }, []);

  useEffect(() => {
    if (activeLead) {
      notesPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeLead]);

  const filteredLeads = leads.filter((lead) => {
    const q = search.toLowerCase();
    return (
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(q) ||
      lead.phone?.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.interestedVehicle?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <Users2 size={24} />
                Leads
              </h1>
              <p className="page-subtitle">Manage customer enquiries</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <GitBranch size={18} />
                Lead Pipeline
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
                  placeholder="Search leads..."
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
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="cell-id">#{lead.id}</td>
                      <td className="cell-name">
                        {lead.firstName} {lead.lastName}
                      </td>
                      <td>{lead.phone}</td>
                      <td>{lead.email}</td>
                      <td>{lead.interestedVehicle}</td>
                      <td>{lead.status}</td>

                      <td>
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value)
                          }
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="OFFER_SHARED">OFFER_SHARED</option>
                          <option value="APPLICATION_STARTED">
                            APPLICATION_STARTED
                          </option>
                          <option value="APPLICATION_SUBMITTED">
                            APPLICATION_SUBMITTED
                          </option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="LOST">LOST</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenNotes(lead)}
                          >
                            <MessageSquare size={14} />
                            Notes
                          </button>

                          {role === "ROLE_ADMIN" && (
                            <button
                              className="btn btn-negative btn-sm"
                              onClick={() => handleDeleteLead(lead)}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {activeLead && (
            <div
              className="panel"
              style={{ marginTop: "20px" }}
              ref={notesPanelRef}
            >
              <div className="panel-header">
                <h3>
                  <MessageSquare size={18} />
                  Notes — {activeLead.firstName} {activeLead.lastName}
                </h3>
                <button className="btn btn-ghost btn-sm" onClick={closeNotes}>
                  Close
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                  <input
                    type="text"
                    placeholder="Add a note about this lead..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddNote();
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleAddNote}
                    disabled={savingNote || !noteText.trim()}
                  >
                    <Send size={14} />
                    {savingNote ? "Adding..." : "Add Note"}
                  </button>
                </div>

                {loadingNotes ? (
                  <p style={{ color: "var(--ink-soft)" }}>Loading notes...</p>
                ) : notes.length === 0 ? (
                  <p style={{ color: "var(--ink-soft)" }}>
                    No notes yet for this lead.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        style={{
                          padding: "12px 14px",
                          background: "var(--slate-tint)",
                          borderRadius: "8px",
                          borderLeft: "3px solid var(--rust)",
                        }}
                      >
                        <p style={{ fontSize: "14px", marginBottom: "6px" }}>
                          {note.note}
                        </p>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            color: "var(--ink-soft)",
                          }}
                        >
                          <Clock size={12} />
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Leads;