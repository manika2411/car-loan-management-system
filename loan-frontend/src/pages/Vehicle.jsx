import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";
import {
  Car,
  CheckCircle2,
  ListChecks,
  PlusCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const EMPTY_FORM = {
  brand: "",
  model: "",
  variant: "",
  price: "",
  interestRate: "",
  active: true,
};

function Vehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const loadVehicles = async () => {
    try {
      const data = await getVehicles();

      setVehicles(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let mounted = true;
  
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
  
        if (mounted) {
          setVehicles(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchVehicles();
  
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateVehicle(editingId, formData);
      } else {
        await createVehicle(formData);
      }

      setFormData(EMPTY_FORM);
      setEditingId(null);

      loadVehicles();
    } catch (error) {
      console.error(error);
      alert("Failed to save vehicle");
    }
  };

  const handleEditClick = (vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      variant: vehicle.variant,
      price: vehicle.price,
      interestRate: vehicle.interestRate,
      active: vehicle.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = async (vehicle) => {
    if (
      !window.confirm(
        `Delete ${vehicle.brand} ${vehicle.model} ${vehicle.variant}? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteVehicle(vehicle.id);
      loadVehicles();
    } catch (error) {
      console.error(error);
      alert("Failed to delete vehicle");
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
                <Car size={24} />
                Vehicles
              </h1>

              <p className="page-subtitle">Manage vehicle catalogue</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                {editingId ? <Pencil size={18} /> : <PlusCircle size={18} />}
                {editingId ? "Edit Vehicle" : "Add Vehicle"}
              </h3>
            </div>

            <form className="vehicle-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="variant"
                placeholder="Variant"
                value={formData.variant}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                step="0.1"
                name="interestRate"
                placeholder="Interest Rate"
                value={formData.interestRate}
                onChange={handleChange}
                required
              />

              <label className="vehicle-check">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <CheckCircle2 size={16} />
                Active
              </label>

              <button type="submit" className="primary-btn">
                {editingId ? <Pencil size={16} /> : <PlusCircle size={16} />}
                {editingId ? "Update Vehicle" : "Add Vehicle"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCancelEdit}
                  style={{ marginLeft: "10px" }}
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <ListChecks size={18} />
                Vehicle Catalogue
              </h3>
            </div>

            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Variant</th>
                    <th>Price</th>
                    <th>Interest</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {[...vehicles].sort((a, b) => a.id - b.id).map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>#{vehicle.id}</td>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.variant}</td>
                      <td>₹ {vehicle.price}</td>
                      <td>{vehicle.interestRate}%</td>
                      <td>
                        <span
                          className={
                            vehicle.active
                              ? "status-approved"
                              : "status-rejected"
                          }
                        >
                          <CheckCircle2 size={14} />
                          {vehicle.active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditClick(vehicle)}
                          >
                            <Pencil size={13} />
                            Edit
                          </button>

                          <button
                            className="btn btn-negative btn-sm"
                            onClick={() => handleDelete(vehicle)}
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
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

export default Vehicle;