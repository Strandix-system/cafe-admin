import TableComponent from "../TableComponent/TableComponent";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import { useMemo } from "react";
import { API_ROUTES } from "../../utils/api_constants";
import { APIRequest } from "../../utils/api_request";
const MenuList = () => {
  const navigate = useNavigate();
  // 🔹 Table Columns
  const columns = useMemo(
    () => [
      {
        id: "image",
        header: "Image",
        Cell: ({ row }) => (
          <img
            src={row.original.image}
            alt="menu"
            className="w-12 h-12 rounded-lg object-cover"
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Item Name",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ row }) => `₹ ${row.original.price}`,
      },
      {
        accessorKey: "discountPrice",
        header: "Discount Price",
        Cell: ({ row }) =>
          row.original.discountPrice
            ? `₹ ${row.original.discountPrice}`
            : "-",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    []
  );

  // 🔹 Row Actions
  const actions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => {
        navigate(`/menu/view/${row.original._id}`);
      },
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => {
      navigate(`/menu/create-edit/${row.original._id}`);
      },
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => {
    //   console.log("Delete:", row.original._id);
      },
    },
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
        <Typography variant="h6" fontWeight={600}>
          Menu Management
        </Typography>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#6F4E37" }}
          startIcon={<Plus size={18} />}
          onClick={() => navigate("/menu-list")}
        >
          Create Menu
        </Button>
      </Box>

      {/* Table */}
      <TableComponent
        
        columns={columns}
        actions={actions}
        actionsType="menu"
        querykey="menu-list"
        getApiEndPoint="MENU_LIST"
        deleteApiEndPoint={API_ROUTES.MENU_DELETE}
        deleteAction={true}
        enableExportTable={true}
      />
    </div>
  );
};

export default MenuList;
