import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TableComponent from "../../components/TableComponent/TableComponent";
import { API_ROUTES } from "../../utils/api_constants";


const AdminRequest = () => {
    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();

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

    const actions = [
        {
            label: "Actions",
            icon: ({ row }) => (
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                        whiteSpace: "nowrap",
                    }}
                >
                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() =>
                            handleStatusChange(row.original._id, "accepted")
                        }
                    >
                        Accept
                    </Button>

                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() =>
                            handleStatusChange(row.original._id, "rejected")
                        }
                    >
                        Reject
                    </Button>
                </Box>
            ),
        },
    ];

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    return (
        <div>
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
                actionsType="icons"
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
