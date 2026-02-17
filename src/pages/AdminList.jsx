import TableComponent from "../components/TableComponent/TableComponent"
import { Box, Button, Switch, Chip, Typography } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { useNavigate, useParams } from 'react-router-dom'
import { Edit, Eye, Power, Trash2, Plus, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from "react-hot-toast";
import { API_ROUTES } from "../utils/api_constants";
import { usePatch } from "../utils/hooks/api_hooks";
import { queryClient } from "../lib/queryClient";

const AdminList = () => {
  const navigate = useNavigate();
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const { adminId } = useParams();

  const [activeTab, setActiveTab] = useState("active");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCafeId, setSelectedCafeId] = useState(null);

  const { mutate: updateUserStatus } = usePatch(
    `${API_ROUTES.updateStatus}/${selectedUserId}`,
    {
      onSuccess: () => {
        // 🔁 refresh admin table after update
        toast.success("Status updated");
        queryClient.invalidateQueries({ queryKey: "get-users" });
      },
      onError: (error) => {
        console.error("Status update failed:", error);
      },
    },
  );

  const handleToggleStatus = (row) => {
    const currentStatus = !row.original.isActive;
    setSelectedUserId(row.original._id);
    setActiveTab(currentStatus ? "active" : "inactive");
    updateUserStatus({
      isActive: currentStatus,
    });
  };

  const customerColumns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Customer Name",
      },
      {
        accessorKey: "phoneNumber",
        header: "Contact",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) =>
          new Date(cell.getValue()).toLocaleDateString(),
      },
    ],
    []
  );


  const cafeColumns = useMemo(
    () => [
      {
        id: "cafeName",
        header: "Cafe Name",
        Cell: ({ row }) => row.original.cafeName,
      },
      {
        id: "ownerName",
        header: "Owner Name",
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
            <Chip
              label={isActive ? "Active" : "Inactive"}
              size="small"
            />
          );
        },
      },
    ],
    []
  );

  // 🔹 Row actions (icons)
  const actions = [
    {
      label: "View Customer",
      icon: User,
      onClick: (row) => {
        setSelectedCafeId(row.original._id); // ✅ cafeId
      },
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => {
        navigate(`/cafe/create-edit/${row.original._id}`);
      },
    },
    {
      label: activeTab === "active" ? "Deactivate" : "Activate",
      icon: Power,
      onClick: handleToggleStatus,
    },
  ];
  const endPoint = selectedCafeId
    ? "user_list"
    : "getUsers"

  const queryParams = selectedCafeId
    ? { adminId: selectedCafeId }
    : {};

  return (

    <div className="overflow-hidden">
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Cafe Management
        </Typography>
        {isSuperAdmin && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#6F4E37" }}
            startIcon={<Plus size={18} />}
            onClick={() => navigate("/cafe/create-edit")}
          >
            Create Cafe
          </Button>
        )}
        {selectedCafeId && (
          <Button
            variant="outlined"
            onClick={() => setSelectedCafeId(null)}
          >
            Back to Cafes
          </Button>
        )}
      </Box>

      <TableComponent
        slug="admin"
        columns={selectedCafeId ? customerColumns : cafeColumns}
        actions={actions}
        actionsType="menu"
        querykey={
          selectedCafeId
            ? `get-cafe-users-${selectedCafeId}`
            : "get-users"
        }
        getApiEndPoint={endPoint}
        params={queryParams}
        deleteApiEndPoint="deleteCafe"
        deleteAction={isSuperAdmin}
      // enableExportTable={true}
      />
    </div>
  );
};

export default AdminList;
