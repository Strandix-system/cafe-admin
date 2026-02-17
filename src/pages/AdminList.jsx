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
import { Tabs, Tab } from "@mui/material";

const AdminList = () => {
  const navigate = useNavigate();
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const { adminId } = useParams();

  const [activeTab, setActiveTab] = useState("active"); // active | inactive
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { mutate: updateUserStatus } = usePatch(
    `${API_ROUTES.updateStatus}/${selectedUserId}`,
    {
      onSuccess: () => {
        // 🔁 refresh admin table after update
        toast.success("Status updated");
        queryClient.invalidateQueries({ queryKey: ["get-users-active"] });
        queryClient.invalidateQueries({ queryKey: ["get-users-inactive"] });

        if (adminId) {
          queryClient.invalidateQueries({
            queryKey: [`get-cafe-users-${adminId}`],
          });
        }
      },
      onError: (error) => {
        console.error("Status update failed:", error);
      },
    },
  );

  const handleToggleStatus = (row) => {
    const currentStatus = row.original.isActive;
    setSelectedUserId(row.original._id);
    updateUserStatus({
      isActive: !currentStatus, // ✅ always true / false
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
        navigate(`/cafes/${row.original._id}`); //
        // setSelectedCafeId(row.original._id); // ✅ cafeId
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
      label: "Toggle Status",
      icon: Power,
      onClick: handleToggleStatus,
    },
  ];

  const getApiEndPoint = adminId ? "user_list" : "getUsers";

  const queryParams = adminId
    ? { adminId } // customer view
    : { isActive: activeTab === "active" };

  const queryKey = adminId
    ? `get-cafe-users-${adminId}`
    : `get-users-${activeTab}`;

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
          {/* Cafe Management */}
          {adminId ? "Customer Management" : "Cafe Management"}
        </Typography>

        <Box display="flex" gap={2}>
          {adminId && (
            <Button
              variant="outlined"
              onClick={() => navigate("/cafes")}
            >
              Back to Cafes
            </Button>
          )}

          {isSuperAdmin && !adminId && (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#6F4E37" }}
              startIcon={<Plus size={18} />}
              onClick={() => navigate("/cafe/create-edit")}
            >
              Create Cafe
            </Button>
          )}
          {/* {selectedCafeId && (
          <Button
            variant="outlined"
            onClick={() => setSelectedCafeId(null)}
          >
            Back to Cafes
          </Button>
        )} */}
        </Box>
      </Box>

      {!adminId && (
        <Box sx={{ px: 3, mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
              },
            }}
          >
            <Tab label="Active Cafes" value="active" />
            <Tab label="Inactive Cafes" value="inactive" />
          </Tabs>
        </Box>
      )}

      <TableComponent
        slug={adminId ? "user" : "admin"}
        columns={adminId ? customerColumns : cafeColumns}
        actions={actions}
        actionsType="menu"
        querykey={queryKey}
        getApiEndPoint={getApiEndPoint}
        params={queryParams}
        deleteApiEndPoint="deleteCafe"
        deleteAction={isSuperAdmin}
      // enableExportTable={true}
      />
    </div>
  );
};

export default AdminList;
