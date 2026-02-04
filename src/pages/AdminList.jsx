import TableComponent from "./TableComponent/TableComponent"
import { Box, Button, Switch, Chip } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { useNavigate, useParams } from 'react-router-dom'
import { Edit, Eye, Power, Trash2, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from "react-hot-toast";
import { API_ROUTES } from "../utils/api_constants"
import { usePatch } from "../utils/hooks/api_hooks"
import { queryClient } from "../lib/queryClient"

const AdminList = () => {
    const navigate = useNavigate();
    const { user, isSuperAdmin, isAdmin } = useAuth();
    const { adminId } = useParams();

    const [activeTab, setActiveTab] = useState("active");
    const [selectedUserId, setSelectedUserId] = useState(null);
    
  const { mutate: updateUserStatus } = usePatch(
    selectedUserId ? API_ROUTES.updateUsers(selectedUserId) : null,
    {
      onSuccess: () => {
        // 🔁 refresh admin table after update
        toast.success("Status updated");
        queryClient.invalidateQueries({ queryKey: [`get-users-${adminId}`] });
        queryClient.invalidateQueries({ queryKey: ["get-users"] });
      },
      onError: (error) => {
        console.error("Status update failed:", error);
      },
    }
  );

  const handleToggleStatus = (row) => {
    const newStatus = !row.original.isActive;
    setSelectedUserId(row.original._id);
    updateUserStatus({
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
    {
      label: activeTab === "active" ? "Deactivate" : "Activate",
      icon: Power,
      onClick: handleToggleStatus,
    }
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
