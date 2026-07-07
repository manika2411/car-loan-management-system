import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createLead } from "../services/leadService";
import { getVehicles } from "../services/vehicleService";
import { UserPlus, Save } from "lucide-react";

function AddLead() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [lead, setLead] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    interestedVehicle: "",
  });
  const handleChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLead(lead);
      navigate("/leads");
    } catch (error) {
      console.error(error);
      alert("Failed to create lead");
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
                <UserPlus size={24} />
                Add Lead
              </h1>
              <p className="page-subtitle">Register a new customer enquiry</p>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <h3>
                <UserPlus size={18} />
                Add Lead
              </h3>
            </div>

            <form className="vehicle-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={lead.firstName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lead.lastName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={lead.phone}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={lead.email}
                onChange={handleChange}
              />

              <select
                name="interestedVehicle"
                value={lead.interestedVehicle}
                onChange={handleChange}
                required>
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={`${vehicle.brand} ${vehicle.model} ${vehicle.variant}`}
                  >
                    {vehicle.brand} {vehicle.model} {vehicle.variant}
                  </option>
                ))}
              </select>
              <div></div>
              <button className="primary-btn lead-btn" type="submit">
                <Save size={18} />
                Save Lead
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddLead;