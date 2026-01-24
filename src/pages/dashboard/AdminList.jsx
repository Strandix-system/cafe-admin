import { useEffect, useState } from "react";
import {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../services/aminService.js"
import AdminForm from "./AdminForm";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAdmins = async () => {
    const res = await getAdmins();
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = async (data) => {
    await addAdmin(data);
    fetchAdmins();
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    await updateAdmin(selectedAdmin._id, data);
    fetchAdmins();
    setSelectedAdmin(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      await deleteAdmin(id);
      fetchAdmins();
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>➕ Add Admin</button>

      {showForm && (
         <div className="mb-6">
        <AdminForm
          initialData={selectedAdmin}
          onSubmit={selectedAdmin ? handleUpdate : handleAdd}
          onClose={() => {
            setShowForm(false);
            setSelectedAdmin(null);
          }}
        />
          </div>

      )}

      <table>
        <thead>
          <tr>
          </tr>
        </thead>

        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.firstName} {admin.lastName}</td>
              <td>{admin.email}</td>
              <td>{admin.phone}</td>
              <td>{admin.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => {
                  setSelectedAdmin(admin);
                  setShowForm(true);
                }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(admin._id)}>
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
