import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllUsers, getAllRoles, updateUserRole } from "../services/userService";
import { Users as UsersIcon, UserCircle2, ShieldCheck, Save, Search } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    const loadRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadUsers();
    loadRoles();
  }, []);

  const handleRoleSelect = (userId, roleName) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: roleName }));
  };

  const handleRoleUpdate = async (userId) => {
    const newRole = selectedRoles[userId];

    if (!newRole) {
      alert("Select a role first");
      return;
    }

    try {
      setSavingId(userId);
      const updatedUser = await updateUserRole(userId, newRole);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updatedUser : u))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update role");
    } finally {
      setSavingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q)
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
                <UsersIcon size={24} />
                User Management
              </h1>
              <p className="page-subtitle">Manage system users</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>
                <UserCircle2 size={18} />
                Users
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
                  placeholder="Search users..."
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
                    <th>Email</th>
                    <th>Role</th>
                    <th>Update Role</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="tag tag-positive">
                          <ShieldCheck size={14} />
                          {user.roles?.map((role) => role.name).join(", ")}
                        </span>
                      </td>
                      <td>
                        <select
                          value={
                            selectedRoles[user.id] ??
                            user.roles?.[0]?.name ??
                            ""
                          }
                          onChange={(e) =>
                            handleRoleSelect(user.id, e.target.value)
                          }
                        >
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>{" "}
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleRoleUpdate(user.id)}
                          disabled={savingId === user.id}
                        >
                          <Save size={14} />
                          {savingId === user.id ? "Saving..." : "Update"}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                        }}
                      >
                        No users found
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

export default Users;