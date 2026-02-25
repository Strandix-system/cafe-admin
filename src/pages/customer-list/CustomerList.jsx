import TableComponent from "../../components/TableComponent/TableComponent";
import { Box, Button, Typography } from "@mui/material";
import { Edit, Plus, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import AddEditUser from "../addEditUser/AddEditUser";
import { useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/commonButton";

export const CustomerList = () => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

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
        ], []
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
        </div>

    );
};


