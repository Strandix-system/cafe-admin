import TableComponent from "./TableComponent/TableComponent";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreateCategoryDialog from "../components/categories/CreateCategoryDialog";

const CategoriesList = () => {
    console.log("✅ CategoriesList component mounted");
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const { isSuperAdmin } = useAuth();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Category",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  const actions = [
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => {
        navigate(`/dashboard/categories/edit/${row.original._id}`);
      },
    },
  ];

  return (
    <div>
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
                  <Button
                      variant="contained"
                      startIcon={<Plus size={18} />}
                      onClick={() => setOpenDialog(true)}
                  >
                      Create Category
                  </Button>
       </Box>

      <TableComponent
        slug="category"
        columns={columns}
        actions={actions}
        actionsType="menu"
        querykey="get-categories"
        getApiEndPoint="getCategories"
        deleteApiEndPoint="deleteCategory"
        deleteAction={isSuperAdmin}
        enableExportTable={true}
      />

      <CreateCategoryDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default CategoriesList;
