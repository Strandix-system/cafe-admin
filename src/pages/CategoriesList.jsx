import { TableComponent } from "../components/TableComponent/TableComponent";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CreateCategoryDialog } from "../components/categories/CreateCategoryDialog";
import { CommonHeader } from "../components/common/CommonHeader";

export const CategoriesList = () => {
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
    ],
    [],
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
      <CommonHeader
        title="Categories"
        buttonText="Create Category"
        buttonIcon={<Plus size={18} />}
        onButtonClick={() => {
          setSelectedCategory(null);
          setOpenDialog(true);
        }}
      />

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
