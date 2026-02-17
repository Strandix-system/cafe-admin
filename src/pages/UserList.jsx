import TableComponent from "../components/TableComponent/TableComponent"
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

const UserList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    //  Table Columns
    const columns = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "Full Name",

                Cell: ({ cell }) => <span className="font-medium">{cell.getValue()}</span>,
            },
            {
                accessorKey: "phoneNumber",
                header: "Phone Number",
            },


            // {
            //   accessorKey: "tableNumber",
            //   header: "Table Number",
            //   Cell: ({ row }) => {
            //       const val = row.original.tableNumber;
            //       return val ? (
            //           <Box sx={{
            //               backgroundColor: '#F5F5F5',
            //               px: 1.5, py: 0.5,
            //               borderRadius: 1,
            //               display: 'inline-block',
            //               fontWeight: 600
            //           }}>
            //               {val}
            //           </Box>
            //       ) : "-";
            //   },
            // },
        ],
        []
    );

    const actions = useMemo(() => {
        return [
            {
                label: "Show Orders",
                icon: Plus, // you can change icon later
                onClick: (row) => {
                    navigate(`/cafe/my-orders/${row.original._id}`);
                },
            },
        ];
    }, [navigate]);
    // Conditionally set actions based on role
    // const actions = useMemo(() => {
    //     // Only enable actions for admin, not for superadmin
    //     if (isAdmin && !isSuperAdmin) {
    //         return [
    //             {
    //                 label: "Orders",
    //                 icon: Plus,
    //                 onClick: (row) => {
    //                     navigate(`/cafe/my-orders/${row.original._id}`);
    //                 },
    //             },
    //         ];
    //     }
    //     return []; // No actions for superadmin or other roles
    // }, [isAdmin, isSuperAdmin, navigate]);

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
                {isAdmin && (
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#6F4E37",
                            "&:hover": { backgroundColor: "#5A3E2B" }
                        }}
                        startIcon={<Plus size={18} />}
                        onClick={() => navigate("/users/create")}
                    >
                        Create User
                    </Button>
                )}
            </Box>

            {/* Table */}
            <TableComponent
                slug="User"
                columns={columns}
                actions={actions}
                actionType="menu"
                querykey="get-customers"
                getApiEndPoint="getCustomers"
                deleteApiEndPoint="customer/delete"
                deleteAction={isAdmin}
                enableExportTable={true}
                manualPagination={true}
                serialNo={true}
            />
        </div>
    );
};

export default UserList;