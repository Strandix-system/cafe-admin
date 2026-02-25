import TableComponent from "../components/TableComponent/TableComponent"
import { Box, Button, Chip, Typography, Tabs, Tab } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { useNavigate, useParams } from 'react-router-dom'
import { Edit, Power, Plus, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from "react-hot-toast";
import { API_ROUTES } from "../utils/api_constants";
import { usePatch } from "../utils/hooks/api_hooks";
import { queryClient } from "../lib/queryClient";
import CommonButton from "../components/common/commonButton";

export const AdminList = () => {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const { adminId } = useParams();

  const [activeTab, setActiveTab] = useState("active"); // active | inactive
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { mutate: updateUserStatus } = usePatch(
    `${API_ROUTES.updateStatus}/${selectedUserId}`,
    {
      onSuccess: () => {
        toast.success("Status updated");
        queryClient.invalidateQueries({ queryKey: [`get-users-${activeTab}`] });

        if (adminId) {
          queryClient.invalidateQueries({
            queryKey: [`get-cafe-users-${adminId}`],
          });
        }
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const handleToggleStatus = (row) => {
    const currentStatus = !row.original.isActive;
    setSelectedUserId(row.original._id);
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
              color={isActive ? "success" : "failure"}
              size="small"
            />
          );
        },
      },
    ],
    []
  );

  const actions = [
    {
      label: "View Customer",
      icon: User,
      onClick: (row) => {
        navigate(`/cafes/${row.original._id}`);
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
            <CommonButton
              variant="outlined"
              onClick={() => navigate("/cafes")}
            >
              Back to Cafes
            </CommonButton>
          )}

          {isSuperAdmin && !adminId && (
            <CommonButton
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => navigate("/cafe/create-edit")}
            >
              Create Cafe
            </CommonButton>
          )}
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
      )
      }

      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>

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
      </Box>
    </div >
  );
};


