import { TableComponent } from "../../components/TableComponent/TableComponent";
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import { useMemo } from "react";
import { API_ROUTES } from "../../utils/api_constants";
import { APIRequest } from "../../utils/api_request";
import { EditMenuModal } from "./EditMenuModal";
import { useState } from "react";
import { CreateEditMenuModal } from "./CreateEditMenuModal";
import { CommonButton } from "../../components/common/commonButton";
import { useFetch } from "../../utils/hooks/api_hooks";


export const MenuList = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  const { data: { result: { results: categories = [] } = {} } = {}, } = useFetch(
    "categories",
    API_ROUTES.getCategories
  );


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

  const queryParams = selectedCategory ? { category: selectedCategory } : {};

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

        <CommonButton
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => {
            setMenuId(null); // create mode
            setOpen(true);
          }}
        >
          Create Menu
        </CommonButton>
      </Box>

      <CreateEditMenuModal
        open={open}
        menuId={menuId}
        onClose={() => {
          setOpen(false);
          setMenuId(null);
        }}
      />
      {/* Table */}
      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableComponent
          slug="menu"
          columns={columns}
          actions={actions}
          actionsType="icons"
          querykey={`menu-list-${selectedCategory}`}
          params={queryParams}
          getApiEndPoint="menulist"
          deleteApiEndPoint="MENU_DELETE"
          deleteAction={true}
          enableExportTable={true}


        />
      </Box>


    </div>
  );
};
