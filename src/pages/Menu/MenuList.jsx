import { TableComponent } from "../../components/TableComponent/TableComponent";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Plus } from "lucide-react";
import { useMemo } from "react";
import { API_ROUTES } from "../../utils/api_constants";
import { useState } from "react";
import { CreateEditMenuModal } from "./CreateEditMenuModal";
import { useFetch } from "../../utils/hooks/api_hooks";
import { formatAmount } from "../../utils/utils";
import { CommonHeader } from "../../components/common/CommonHeader";

export const MenuList = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: { result: { categories: adminCategories = [] } = {} } = {} } =
    useFetch("admin-categories", API_ROUTES.getAdminCategories);

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
        Cell: ({ row }) => `₹ ${formatAmount(row.original.price)}`,
      },
      {
        accessorKey: "discountPrice",
        header: "Discount Price",
        Cell: ({ row }) =>
          row.original.discountPrice
            ? `₹ ${formatAmount(row.original.discountPrice)}`
            : "-",
      },
    ],
    [],
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
      <CommonHeader
        title="Menu Management"
        buttonText="Create Menu"
        buttonIcon={<Plus size={18} />}
        onButtonClick={() => {
          setMenuId(null);
          setOpen(true);
        }}
      />

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
              {adminCategories.map((cat) => (
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
