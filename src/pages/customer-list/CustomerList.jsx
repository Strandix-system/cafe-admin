import { TableComponent } from "../../components/TableComponent/TableComponent";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import { Edit, Plus, Eye, Crown, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { AddEditUser } from "../addEditUser/AddEditUser";
import { useNavigate } from "react-router-dom";
import { CommonButton } from "../../components/common/commonButton";
import { Chip, Stack } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import { InputField } from "../../components/common/InputField";
import { formatAmount } from "../../utils/utils";

const StatCard = ({ title, value, highlight = false, large = false }) => {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: highlight
          ? "linear-gradient(135deg,#FDBA00,#F59E0B)"
          : "#ffffff",
        border: highlight ? "none" : "1px solid #E5E7EB",
        boxShadow: highlight
          ? "0 10px 25px rgba(245,158,11,0.25)"
          : "0 2px 6px rgba(0,0,0,0.05)",
        minHeight: 90,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: highlight ? "#000" : "#6B7280",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: large ? 20 : 22,
          fontWeight: 700,
          color: highlight ? "#000" : "#111827",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};
export const CustomerList = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("");
  const queryParams = selectedStatus ? { status: selectedStatus } : {};
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Full Name",
        Cell: ({ row }) => {
          const { name, customerStatus } = row.original;

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  ml: 1,
                }}
              >
                {customerStatus === "frequent" && (
                  <Chip
                    label="Frequent"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "10px",
                      fontWeight: 600,
                      bgcolor: "#1B5E20",
                      color: "#fff",
                      // right: -40,
                      borderRadius: "10px",
                      "& .MuiChip-label": {
                        px: 0.8,
                      },
                    }}
                  />
                )}
                {customerStatus === "new" && (
                  <Chip
                    label="New"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "10px",
                      fontWeight: 500,
                      bgcolor: "#E5E7EB",
                      color: "#374151",
                      borderRadius: "10px",
                      "& .MuiChip-label": {
                        px: 0.8,
                      },
                    }}
                  />
                )}

                {/* VIP Badge */}
                {customerStatus === "vip" && (
                  <Chip
                    label="VIP"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "10px",
                      fontWeight: 700,
                      bgcolor: "#F59E0B",
                      color: "#000",
                      borderRadius: "10px",
                      "& .MuiChip-label": {
                        px: 0.8,
                      },
                    }}
                    icon={<Crown size={14} />}
                  />
                )}
              </Box>
            </Stack>
          );
        },
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
      },
      {
        accessorKey: "totalOrder",
        header: "Total Orders",
      },
      {
        accessorKey: "totalSpent",
        header: "Total Spent (₹)",
        Cell: ({ cell }) => `₹ ${formatAmount(cell.getValue())}`,
      },
    ],
    [],
  );
  const actions = [
    {
      label: "View Orders",
      icon: Eye,
      onClick: (row) => {
        const userId = row?.original?._id;
        if (userId) {
          navigate(`/my-orders/${userId}`);
        }
      },
    },
    {
      label: "View More Details",
      icon: Info,
      onClick: (row) => {
        setSelectedRow(row.original);
        setDetailsOpen(true);
      },
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => {
        setMode("edit");
        setSelectedUser(row.original);
        setOpen(true);
      },
    },
  ];

  const statusOptions = [
    { _id: "new", name: "New" },
    { _id: "frequent", name: "Frequent" },
    { _id: "vip", name: "VIP" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ color: "#333" }}>
          Customer Management
        </Typography>

        <CommonButton
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => {
            setMode("create");
            setSelectedUser(null);
            setOpen(true);
          }}
        >
          Create User
        </CommonButton>
      </Box>

      {/* Table */}
      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>
        <Box sx={{ width: 220, mb: 1 }}>
          <InputField
            isAutocomplete
            options={statusOptions}
            getOptionLabel={(option) => option.name}
            field={{ value: selectedStatus }}
            onOptionChange={(value) => setSelectedStatus(value?._id || "")}
            placeholder="Filter by Status"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                "&:hover": { bgcolor: "#f2f2f2" },
              },
            }}
          />
        </Box>

        <TableComponent
          slug="user"
          columns={columns}
          actions={actions}
          actionsType="menu"
          // querykey="get-cafe-users"
          querykey={`get-cafe-users-${selectedStatus}`}
          params={queryParams}
          getApiEndPoint="user_list"
          deleteApiEndPoint="deleteUser"
          deleteAction={true}
          enableExportTable={true}
          manualPagination={true}
          serialNo={true}
        />
      </Box>

      <AddEditUser
        open={open}
        mode={mode}
        data={selectedUser}
        onClose={(refresh) => {
          setOpen(false);
        }}
      />

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fafafa",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Customer Details
            </Typography>
            {selectedRow?.customerStatus === "vip" && (
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#F59E0B",
                  fontWeight: 600,
                  mt: 0.5,
                }}
              >
                👑 VIP Customer
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={() => setDetailsOpen(false)}
            sx={{
              bgcolor: "#F3F4F6",
              "&:hover": { bgcolor: "#E5E7EB" },
            }}
          >
            <X size={18} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, py: 1.5 }}>
          {/* Name Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              {selectedRow?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedRow?.phoneNumber}
            </Typography>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <StatCard
                title="Total Orders"
                value={selectedRow?.totalOrder || 0}
              />
            </Grid>

            <Grid item xs={6}>
              <StatCard
                title="Total Spent"
                value={`₹ ${formatAmount(selectedRow?.totalSpent || 0)}`}
                highlight
              />
            </Grid>

            <Grid item xs={12}>
              <StatCard
                title="Favourite Item"
                value={selectedRow?.favoriteItem || "N/A"}
                large
              />
            </Grid>

            <Grid item xs={12}>
              <StatCard
                title="Last Visit"
                value={
                  selectedRow?.lastVisitDate
                    ? new Date(selectedRow.lastVisitDate).toLocaleDateString()
                    : "No Visits Yet"
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};
