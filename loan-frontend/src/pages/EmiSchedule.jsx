import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  getLoanAccountByAccountNumber,
  getEmiSchedule,
} from "../services/emiService";
import { makePayment } from "../services/paymentService";
import {
  CalendarClock,
  Search,
  ListChecks,
  CreditCard,
  CheckCircle2,
  Hash,
  AlertTriangle,
} from "lucide-react";

const isOverdue = (emi) =>
  emi.paymentStatus === "PENDING" && new Date(emi.dueDate) < new Date();

function EmiSchedule() {
  const [accountNumber, setAccountNumber] = useState("");
  const [emis, setEmis] = useState([]);

  const loadSchedule = async () => {
    try {
      console.log("Searching:", accountNumber);
      const account = await getLoanAccountByAccountNumber(accountNumber);
      console.log("ACCOUNT:", account);
      const schedule = await getEmiSchedule(account.id);
      console.log("SCHEDULE:", schedule);
      setEmis(schedule);
    } catch (error) {
      console.error("FULL ERROR:", error);
  
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      }
  
      alert("EMI schedule not found");
    }
  };
  
  const handlePayEmi = async (emi) => {
    try {
      await makePayment(emi.id, {
        amountPaid: emi.emiAmount,
        paymentMethod: "UPI",
        transactionReference: `TXN-${new Date().getTime()}`,
      });
  
      alert("Payment successful");
  
      loadSchedule();
    } catch (error) {
      console.error(error);
  
      alert("Payment failed");
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
                <CalendarClock size={24} />
                EMI Schedule
              </h1>
              <p className="page-subtitle">Track your installments</p>
            </div>
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

              <button className="btn btn-primary" onClick={loadSchedule}>
                <Search size={16} />
                View Schedule
              </button>
            </div>
          </div>

          {emis.length > 0 && (
            <div className="panel" style={{ marginTop: "20px" }}>
              <div className="panel-header">
                <h3>
                  <ListChecks size={18} />
                  EMI Details
                </h3>
              </div>

              <div className="table-wrap">
                <table className="ledger">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Due Date</th>
                      <th>EMI Amount</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                      <th>Status</th>
                      <th>Action</th>
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
                        <td>
                          <span
                            className={
                              emi.paymentStatus === "PAID"
                                ? "tag tag-positive"
                                : isOverdue(emi)
                                ? "tag tag-negative"
                                : "tag tag-progress"
                            }
                          >
                            {isOverdue(emi) && <AlertTriangle size={12} />}
                            {emi.paymentStatus === "PAID"
                              ? "PAID"
                              : isOverdue(emi)
                              ? "OVERDUE"
                              : "PENDING"}
                          </span>
                        </td>
                        <td>
                          {emi.paymentStatus === "PENDING" ? (
                            <button
                              className={
                                isOverdue(emi)
                                  ? "btn btn-negative"
                                  : "btn btn-primary"
                              }
                              onClick={() => handlePayEmi(emi)}
                            >
                              <CreditCard size={14} />
                              {isOverdue(emi) ? "Pay Overdue EMI" : "Pay EMI"}
                            </button>
                          ) : (
                            <span className="tag tag-positive">
                              <CheckCircle2 size={14} />
                              Paid
                            </span>
                          )}
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

export default EmiSchedule;