import TableComponent from "../../components/TableComponent/TableComponent";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import { useMemo } from "react";
import { API_ROUTES } from "../../utils/api_constants";
import { APIRequest } from "../../utils/api_request";
import EditMenuModal from "./EditMenuModal";
import { useState } from "react";
import CreateEditMenuModal from "./CreateEditMenuModal";


const MenuList = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);

  const [selectedMenuId, setSelectedMenuId] = useState(null);

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
        Cell: ({ row }) => row.original.category || "-",
      },
      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ row }) => `₹ ${row.original.price}`,
      },
      {
        accessorKey: "discountPrice",
        header: "Discount Price",
        Cell: ({ row }) => `₹ ${row.original.discountPrice}`,
      },
    ],
    []
  );

  const actions = [
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => {
        setMenuId(row.original._id); // edit mode
        setOpen(true);
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
          onClick={() => {
            setMenuId(null); // create mode
            setOpen(true);
          }}
        >
          Create Menu
        </Button>
      </Box>

      {/* Table */}
      <TableComponent
        slug="menu"
        columns={columns}
        actions={actions}
        actionsType="icons"
        querykey="menu-list"
        getApiEndPoint="menulist"
        deleteApiEndPoint="MENU_DELETE"
        deleteAction={true}
        enableExportTable={true}
      />

      <CreateEditMenuModal
        open={open}
        menuId={menuId}
        onClose={() => {
          setOpen(false);
          setMenuId(null);
        }}
      />

    </div>
  );
};

export default MenuList;