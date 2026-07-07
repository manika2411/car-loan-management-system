import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createApplication } from "../services/applicationService";
import { getVehicles } from "../services/vehicleService";
import { getMyDocuments } from "../services/documentService";
import {
  Send,
  Car,
  Wallet,
  Percent,
  CalendarClock,
  Banknote,
  Calculator,
} from "lucide-react";

function ApplyLoan() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const [vehicleName, setVehicleName] = useState("");
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureMonths, setTenureMonths] = useState("60");

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadVehicles();
  }, []);

  const handleVehicleChange = (e) => {
    const vehicleId = Number(e.target.value);
    setSelectedVehicleId(vehicleId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (vehicle) {
      setVehicleName(`${vehicle.brand} ${vehicle.model} ${vehicle.variant}`);
      setVehiclePrice(vehicle.price);
      setInterestRate(vehicle.interestRate);
    }
  };

  const calculateLoanAmount = () => {
    return Number(vehiclePrice || 0) - Number(downPayment || 0);
  };

  const calculateEmi = () => {
    const principal = calculateLoanAmount();

    const rate = Number(interestRate) / 12 / 100;

    const months = Number(tenureMonths);

    if (!principal || !months) {
      return 0;
    }

    const emi =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);

    return emi.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const documents = await getMyDocuments();
      if (documents.length === 0) {
        alert( "Please upload KYC documents before submitting a loan application.");
        return;
      }
      
      await createApplication({
        vehicleName,
        vehiclePrice: Number(vehiclePrice),
        downPayment: Number(downPayment),
        loanAmount: calculateLoanAmount(),
        interestRate: Number(interestRate),
        tenureMonths: Number(tenureMonths),
        monthlyEmi: Number(calculateEmi()),
      });

      alert("Application submitted successfully");
      navigate("/my-applications");
    } catch (error) {
      console.error(error);
      alert("Failed to submit application");
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
                <Send size={24} />
                Apply For Loan
              </h1>
              <p className="page-subtitle">Vehicle loan application</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <Car size={18} />
                Application Details
              </h3>
            </div>

            <div
              style={{
                padding: "24px",
              }}
            >
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="vehicle">
                    <Car size={16} /> Select Vehicle
                  </label>

                  <select
                    value={selectedVehicleId}
                    onChange={handleVehicleChange}
                    required
                  >
                    <option value="">Choose Vehicle</option>

                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} {vehicle.variant}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>
                    <Banknote size={16} /> Vehicle Price
                  </label>
                  <input type="number" value={vehiclePrice} readOnly />
                </div>

                <div className="field">
                  <label>
                    <Wallet size={16} /> Down Payment
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>
                    <Percent size={16} /> Interest Rate (%)
                  </label>
                  <input type="number" value={interestRate} readOnly />
                </div>

                <div className="field">
                  <label>
                    <CalendarClock size={16} /> Tenure (Months)
                  </label>

                  <select
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(e.target.value)}
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="36">36</option>
                    <option value="48">48</option>
                    <option value="60">60</option>
                    <option value="72">72</option>
                  </select>
                </div>

                <div
                  className="stat-grid"
                  style={{
                    marginTop: "24px",
                  }}
                >
                  <div className="stat-card">
                    <div className="stat-label">
                      <Wallet size={16} />
                      Loan Amount
                    </div>

                    <div className="stat-value">₹ {calculateLoanAmount()}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">
                      <Calculator size={16} />
                      Estimated EMI
                    </div>

                    <div className="stat-value">₹ {calculateEmi()}</div>
                  </div>
                </div>

                <br />

                <button className="btn btn-primary" type="submit">
                  <Send size={16} />
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplyLoan;