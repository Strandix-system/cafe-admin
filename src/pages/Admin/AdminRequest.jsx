import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TableComponent from "../../components/TableComponent/TableComponent";
import { API_ROUTES } from "../../utils/api_constants";
import { usePatch, usePost } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { queryClient } from "../../lib/queryClient";
import { Chip } from "@mui/material";
// import { useQuery } from "@tanstack/react-query";
import { Tabs, Tab } from "@mui/material";
const AdminRequest = () => {


    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();


    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [activeTab, setActiveTab] = useState("requested");
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
            <Tab label="Requested" value="requested" />
            <Tab label="Accepted" value="accepted" />
            <Tab label="Rejected" value="rejected" />
        </Tabs>
    </Box>

    const { mutate: updateRequestStatus } = usePatch(
        API_ROUTES.updateAdminRequestStatus,
        {
            onSuccess: () => {
                toast.success("Status updated successfully");
                queryClient.invalidateQueries({ queryKey: ["adminRequest"] });
            },
            onError: () => {
                toast.error("Failed to update status");
            },
        }
    );
    const columns = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "Owner Name",
            },
            {
                accessorKey: "email",
                header: "Email",
            },
            {
                accessorKey: "phone",
                header: "Mobile Number",
            },
            {
                accessorKey: "city",
                header: "City",
            },
            {
                accessorKey: "message",
                header: "Request Message",
            },
            {
                id: "status",
                header: "Status",
                Cell: ({ row }) => {
                    const status = row.original.status;

                    const colorMap = {
                        requested: "warning",
                        accepted: "success",
                        rejected: "error",
                    };

                    return (
                        <Chip
                            label={status}
                            color={colorMap[status]}
                            size="small"
                        />
                    );
                },
            },
            {
                accessorKey: "createdAt",
                header: "Requested On",
            },

        ],
        []
    );

    const handleStatusChange = (row, status) => {
        updateRequestStatus(
            {
                id: row.original._id,
                data: { status },
            },
            {
                onSuccess: () => {
                    toast.success("Status updated successfully");
                    queryClient.invalidateQueries({
                        queryKey: ["adminRequest"],
                    });
                },
                onError: () => {
                    toast.error("Failed to update status");
                },
            }
        );
    };

    const actions = [
        {
            label: "Accept",
            onClick: (row) => handleStatusChange(row, "accepted"),
            hidden: (row) => row.original.status === "accepted",
        },
        {
            label: "Reject",
            onClick: (row) => handleStatusChange(row, "rejected"),
            hidden: (row) => row.original.status === "rejected",
        },
        {
            label: "Mark as Requested",
            onClick: (row) => handleStatusChange(row, "requested"),
            hidden: (row) => row.original.status === "requested",
        },
    ];

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };
    const queryParams = {
        status: activeTab,
    };

    const queryKey = `adminRequest-${activeTab}`;

    return (
        <div>
            <Typography variant="h5" fontWeight={700}>
                Admin Requests
            </Typography>
            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
            </Box>

            <TableComponent
                slug="adminRequest"
                columns={columns}
                actions={actions}
                actionsType="menu"
                querykey="adminRequest"
                getApiEndPoint="adminRequest"
                // deleteApiEndPoint="deleteCategory"
                queryParams={queryParams}
                enableExportTable={true}

            />

        </div>
    );
};

export default AdminRequest;
