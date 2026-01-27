import TableComponent from "./TableComponent/TableComponent"
import { Button } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { Chip, Typography, Card } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Edit, Eye, Power, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

const AdminList = () => {
    const navigate = useNavigate();
    const { user, isSuperAdmin, isAdmin } = useAuth();
    const { adminId } = useParams();

    const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Admin Name",
        accessorFn: (row) =>
          `${row.firstName || ""} ${row.lastName || ""}`,
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phoneNumber",
        header: "Contact",
      },
      {
        id: "status",
        header: "Status",
        Cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? "Active" : "Inactive"}
            size="small"
            sx={{
              backgroundColor: row.original.isActive
                ? "#d1ffbe"
                : "#ffdada",
              color: row.original.isActive
                ? "#3db309"
                : "#FF0000",
            }}
          />
        ),
      },
    ],
    []
  );

  // 🔹 Row actions (icons)
  const actions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => {
        navigate(`/dashboard/admins/${row.original._id}`);
      },
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => {
        navigate(`/dashboard/admins/edit/${row.original._id}`);
      },
    },
  ];

  return (
    <div>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Admin Management
      </Typography>

      <TableComponent
        slug="admin"
        columns={columns}
        actions={actions}
        querykey="get-users"
        getApiEndPoint="getUsers"
        deleteApiEndPoint="delete"
        deleteAction={isSuperAdmin}   // ✅ only super admin can delete
        enableExportTable={true}
      />
    </div>
  );
};

export default AdminList;
