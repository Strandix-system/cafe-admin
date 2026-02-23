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


const AdminRequest = () => {


    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();

    const [selectedRequestId, setSelectedRequestId] = useState(null);


    const { mutate: updateRequestStatus } = usePost(
        API_ROUTES.updateAdminRequestStatus,
        {
            onSuccess: () => {
                toast.success("Status updated successfully");
                queryClient.invalidateQueries({ queryKey: ["admin-request"] });
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
                accessorKey: "status",
                header: "Status",
            },
            {
                accessorKey: "createdAt",
                header: "Requested On",
            },

        ],
        []
    );

    // const handleStatusChange = (row, status) => {
    //     updateRequestStatus({
    //         id: row.original._id,
    //         data: { status },
    //     });
    // };
    const handleStatusChange = (row, status) => {
        console.log("Updating ID:", row.original._id);
        updateRequestStatus({
            id: row.original._id,
            data: { status },
        });
    };

    const actions = [
        {
            label: "Accept",
            onClick: (row) => handleStatusChange(row, "accepted"),
        },
        {
            label: "Reject",
            onClick: (row) => handleStatusChange(row, "rejected"),
        },
        {
            label: "Mark as Requested",
            onClick: (row) => handleStatusChange(row, "requested"),
        },
    ];


    const handleClose = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

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
                querykey="admin-request"
                getApiEndPoint="adminRequest"
                // deleteApiEndPoint="deleteCategory"
                // deleteAction={isSuperAdmin}
                enableExportTable={true}
            />
        </div>
    );
};

export default AdminRequest;
