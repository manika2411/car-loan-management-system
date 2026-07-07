import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMyPayments } from "../services/paymentService";
import { CreditCard, Receipt } from "lucide-react";

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await getMyPayments();
        setPayments(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadPayments();
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <CreditCard size={24} />
                Payment History
              </h1>
              <p className="page-subtitle">All EMI payments</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <Receipt size={18} />
                Transactions
              </h3>
            </div>

            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>#{payment.id}</td>
                      <td className="cell-money">₹ {payment.amountPaid}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>{payment.transactionReference}</td>
                      <td>
                        {new Date(payment.paymentDate).toLocaleDateString()}
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

export default Payments;