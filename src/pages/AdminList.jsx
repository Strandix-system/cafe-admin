import TableComponent from "./TableComponent/TableComponent"
import { Box, Button, Switch, Chip } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { useNavigate, useParams } from 'react-router-dom'
import { Edit, Eye, Power, Trash2, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { API_ROUTES } from "../utils/api_constants"
import { usePatch } from "../utils/hooks/api_hooks"
import { queryClient } from "../lib/queryClient"

const AdminList = () => {
    const navigate = useNavigate();
    const { user, isSuperAdmin, isAdmin } = useAuth();
    const { adminId } = useParams();

    const [activeTab, setActiveTab] = useState("active");

  const { mutate: updateUserStatus } = usePatch(
    API_ROUTES.updateUsers,
    {
      onSuccess: () => {
        // 🔁 refresh admin table after update
        toast.success("Status updated");
        queryClient.invalidateQueries(["get-users"]);
      },
      onError: (error) => {
        console.error("Status update failed:", error);
      },
    }
  );

  const handleToggleStatus = (row) => {
    const newStatus = !row.original.isActive;

    updateUserStatus({
      id: row.original._id,
      isActive: newStatus,
    });
  };

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
        Cell: ({ row }) => {
          const isActive = row.original.isActive;

          return (
            <Box display="flex" alignItems="center" gap={1}>
              <Switch
                checked={isActive}
                color="success"
                onChange={() => handleToggleStatus(row)}
              />

              <Chip
                label={isActive ? "Active" : "Inactive"}
                size="small"
                sx={{
                  backgroundColor: isActive ? "#D1FFBE" : "#FFDADA",
                  color: isActive ? "#3DB309" : "#FF0000",
                }}
              />
            </Box>
          );
        },
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
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* <Typography variant="h6" fontWeight={600}>
          Admin Management
        </Typography> */}

        {isSuperAdmin && (
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => navigate("admins")}
          >
            Create Admin
          </Button>
        )}
      </Box>

      <TableComponent
        slug="admin"
        columns={columns}
        actions={actions}
        actionsType="menu"
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
