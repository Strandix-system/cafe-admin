import TableComponent from "../../components/TableComponent/TableComponent";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import AddEditUser from "../addEditUser/AddEditUser";

const CustomerList = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);


  // 🔹 Table Columns
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
      //   accessorKey: "tableNumber", 
      //   header: "Table Number",
      //   Cell: ({ row }) => {
      //       const val = row.original.tableNumber;
      //       return val ? (
      //           <Box sx={{ 
      //               backgroundColor: '#F5F5F5', 
      //               px: 1.5, py: 0.5, 
      //               borderRadius: 1, 
      //               display: 'inline-block',
      //               fontWeight: 600 
      //           }}>
      //               {val}
      //           </Box>
      //       ) : "-";
      //   },
      // },
    ],
    []
  );


  const actions = [
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

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#6F4E37",
            "&:hover": { backgroundColor: "#5A3E2B" }
          }}
          startIcon={<Plus size={18} />}
          onClick={() => {
            setMode("create");
            setSelectedUser(null);
            setOpen(true);
          }}
        >
          Create User
        </Button>
      </Box>

      {/* Table */}
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


      <AddEditUser open={open}
        mode={mode}
        data={selectedUser}
        onClose={(refresh) => {
          setOpen(false);
          if (refresh) {
            // 🔄 refresh table
            // window.dispatchEvent(new Event("refetch-table"));
          }
        }} />
    </div>

  );
};


export default CustomerList;