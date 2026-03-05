import { TableComponent } from "../../components/TableComponent/TableComponent";
import { Box, Button, Typography } from "@mui/material";
import { Edit, Plus, Eye, Crown } from "lucide-react";
import { useMemo, useState } from "react";
import { AddEditUser } from "../addEditUser/AddEditUser";
import { useNavigate } from "react-router-dom";
import { CommonButton } from "../../components/common/commonButton";
import { Chip, Stack } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, Divider, Grid, IconButton } from "@mui/material";
import { X } from "lucide-react";

const StatCard = ({ title, value, highlight = false, large = false }) => {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 3,
                background: highlight
                    ? "linear-gradient(135deg, #FACC15, #F59E0B)"
                    : "#F5F3EF",
                color: highlight ? "#000" : "#333",
                boxShadow: highlight
                    ? "0 8px 20px rgba(245, 158, 11, 0.25)"
                    : "none",
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    opacity: 0.7,
                    fontWeight: 500,
                }}
            >
                {title}
            </Typography>

            <Typography
                variant={large ? "h6" : "h5"}
                fontWeight={700}
                sx={{ mt: 1 }}
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
    const navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "Full Name",
                Cell: ({ row }) => {
                    const { name, totalVisit, totalSpent } = row.original;

                    //// 🔴 CHANGED
                    const isVisited = totalVisit > 1;

                    //// 🔴 CHANGED (use backend isVIP)
                    const isVIP = row.original?.isVIP;

                    return (
                        // <Stack direction="row" spacing={1} alignItems="center">
                        //     <span className="font-medium">{name}</span>

                        //     {/* New / Visited */}
                        //     <Chip
                        //         size="small"
                        //         label={isVisited ? "Frequent" : "New"}
                        //         color={isVisited ? "success" : "default"}
                        //     />

                        //     {isVIP && (
                        //         <Chip
                        //             label="VIP"
                        //             size="small"
                        //             sx={{
                        //                 background: "linear-gradient(45deg, #FACC15, #F59E0B)",
                        //                 color: "#000",
                        //                 fontWeight: 600,
                        //                 borderRadius: "20px",
                        //                 px: 1,
                        //             }}
                        //         />
                        //     )}
                        // </Stack>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: "14px",
                                }}
                            >
                               <span className="relative">{name}</span> 
                            </Typography>

                            {/* Status Badge */}
                            <Box sx={{position:"absolute",
                                        top: 8,
                                        left:100,
                                        display:"flex",
                                        gap:0.5}}>
                            {isVisited ? (
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
                            ) : (
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
                            {isVIP && (
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
                accessorKey: "totalVisit",
                header: "Total Visits",
            },
            {
                accessorKey: "totalSpent",
                header: "Total Spent (₹)",
                Cell: ({ cell }) => `₹ ${cell.getValue() || 0}`,
            },
        ],
        []
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
            icon: Eye,
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
    ]

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
                    User Management
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
                <TableComponent
                    slug="user"
                    columns={columns}
                    actions={actions}
                    actionsType="menu"
                    querykey="get-cafe-users"
                    getApiEndPoint="user_list"
                    deleteApiEndPoint="deleteUser"
                    deleteAction={true}
                    enableExportTable={true}
                    manualPagination={true}
                    serialNo={true}
                />
            </Box>

            <AddEditUser open={open}
                mode={mode}
                data={selectedUser}
                onClose={(refresh) => {
                    setOpen(false);
                }} />

            {/* <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <Box sx={{ position: "relative", overflow: "hidden" }}>

                    {selectedRow?.isVIP && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 20,
                                right: -50,
                                width: 180,
                                textAlign: "center",
                                transform: "rotate(45deg)",
                                background: "linear-gradient(45deg, #FACC15, #F59E0B)",
                                color: "#000",
                                fontWeight: 700,
                                py: 0.7,
                                boxShadow: "0 0 15px rgba(250, 204, 21, 0.6)",
                                zIndex: 10,
                            }}
                        >
                            👑 VIP CUSTOMER
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 3,
                            pt: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            Customer Details
                        </Typography>

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

                    <DialogContent dividers>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight={600}>
                                {selectedRow?.name || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedRow?.phoneNumber || "No Phone Number"}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>

                            <Grid item xs={6}>
                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#FAF7F2" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Visits
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {selectedRow?.totalVisit || 0}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#FAF7F2" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Spent
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        ₹ {selectedRow?.totalSpent || 0}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#FAF7F2" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Favourite Item
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {selectedRow?.favoriteItem || "N/A"}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#FAF7F2" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Last Visit
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {selectedRow?.lastVisitDate
                                            ? new Date(selectedRow.lastVisitDate).toLocaleDateString()
                                            : "No Visits Yet"}
                                    </Typography>
                                </Box>
                            </Grid>

                        </Grid>

                    </DialogContent>
                </Box>
            </Dialog> */}

            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <Box sx={{ position: "relative" }}>

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
                            {selectedRow?.isVIP && (
                                <Typography
                                    sx={{
                                        fontSize: 12,
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

                    <DialogContent sx={{ p: 3 }}>

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
                        <Grid container spacing={2}>

                            <Grid item xs={6}>
                                <StatCard
                                    title="Total Visits"
                                    value={selectedRow?.totalVisit || 0}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <StatCard
                                    title="Total Spent"
                                    value={`₹ ${selectedRow?.totalSpent || 0}`}
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
                </Box>
            </Dialog>
        </div>

    );
};


