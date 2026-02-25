import TableComponent from "../components/TableComponent/TableComponent";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreateCategoryDialog from "../components/categories/CreateCategoryDialog";
import CommonButton from "../components/common/commonButton";

export const CategoriesList = () => {
  // console.log("✅ CategoriesList component mounted" );
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { isSuperAdmin } = useAuth();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Category",
      },
      // {
      //   accessorKey: "createdAt",
      //   header: "Created At",
      //   Cell: ({ row }) =>
      //     new Date(row.original.createdAt).toLocaleDateString(),
      // },
    ],
    []
  );

  const actions = [
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => {
        setSelectedCategory(row.original);
        setOpenDialog(true);
      },
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
        <CommonButton
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => {
            setSelectedCategory(null);
            setOpenDialog(true);
          }}
        >
          Create Category
        </CommonButton>
      </Box>

      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>

        <TableComponent
          slug="category"
          columns={columns}
          actions={actions}
          actionsType="icons"
          querykey="get-categories"
          getApiEndPoint="getCategories"
          deleteApiEndPoint="deleteCategory"
          deleteAction={isSuperAdmin}
          enableExportTable={true}
        />
      </Box>

      <CreateCategoryDialog
        open={openDialog}
        handleClose={handleClose}
        category={selectedCategory}
      />
    </div>
  );
};

