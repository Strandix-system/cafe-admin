// import TableComponent from "../TableComponent/TableComponent";
// import { Box, Button, Chip, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { Edit, Eye, Trash2, Plus } from "lucide-react";
// import { useMemo } from "react";
// import { API_ROUTES } from "../../utils/api_constants";
// import { APIRequest } from "../../utils/api_request";
// import EditMenuModal from "./EditMenuModal";
// import { useState } from "react";
// const MenuList = () => {
//   const navigate = useNavigate();
//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedMenuId, setSelectedMenuId] = useState(null);

//   // 🔹 Table Columns
//   const columns = useMemo(
//     () => [
//       {
//         id: "image",
//         header: "Image",
//         Cell: ({ row }) => (
//           <img
//             src={row.original.image}
//             alt="menu"
//             className="w-12 h-12 rounded-lg object-cover"
//           />
//         ),
//       },
//       {
//         accessorKey: "name",
//         header: "Item Name",
//       },
//       {
//         accessorKey: "phonenumber",
//         header: "Category",
//         Cell: ({ row }) => row.original.category?.name || "-",
//       },

//       {
//         accessorKey: "tablenumber",
//         header: "Price",
//         Cell: ({ row }) => `₹ ${row.original.price}`,
//       },
//     ],
//     []
//   );

//   const actions = [
    
//     {
//       label: "Edit",
//       icon: Edit,
//       onClick: (row) => {
//       navigate(`/menu/create-edit/${row.original._id}`);
//       },
//     },
//   ];

//   return (
//     <div className="overflow-hidden">
//       {/* Header */}
//       <Box
//         sx={{
//           p: 3,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography variant="h6" fontWeight={600}>
//           Menu Management
//         </Typography>

//         <Button
//           variant="contained"
//           sx={{ backgroundColor: "#6F4E37" }}
//           startIcon={<Plus size={18} />}
//           onClick={() => navigate("/create-menu")}
//         >
//           Create Menu
//         </Button>
//       </Box>

//       {/* Table */}
//        <TableComponent
//         slug="menu"
//         columns={columns}
//         actions={actions}
//         actionsType="menu"
//         querykey="menu-list"
//         getApiEndPoint="MENU_LIST"
//         deleteApiEndPoint="menu/delete"
//         deleteAction={true}
//         enableExportTable={true}
//       />
//     </div>
//   );
// };

// export default MenuList;


// import TableComponent from "../TableComponent/TableComponent";
// import { Box, Button, Chip, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { Edit, Eye, Trash2, Plus } from "lucide-react";
// import { useMemo } from "react";
// import { API_ROUTES } from "../../utils/api_constants";
// import { APIRequest } from "../../utils/api_request";
// import EditMenuModal from "./EditMenuModal";
// import { useState } from "react";

// const MenuList = () => {
//   const navigate = useNavigate();
//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedMenuId, setSelectedMenuId] = useState(null);

//   // 🔹 Table Columns
//   const columns = useMemo(
//     () => [
//       {
//         id: "image",
//         header: "Image",
//         Cell: ({ row }) => (
//           <img
//             src={row.original.image}
//             alt="menu"
//             className="w-12 h-12 rounded-lg object-cover"
//           />
//         ),
//       },
//       {
//         accessorKey: "name",
//         header: "Item Name",
//       },
//       {
//         accessorKey: "phonenumber",
//         header: "Category",
//         Cell: ({ row }) => row.original.category?.name || "-",
//       },
//       {
//         accessorKey: "tablenumber",
//         header: "Price",
//         Cell: ({ row }) => `₹ ${row.original.price}`,
//       },
//     ],
//     []
//   );

//   const actions = [
//     {
//       label: "Edit",
//       icon: Edit,
//       onClick: (row) => {
//         navigate(`/menu/create-edit/${row.original._id}`);
//       },
//     },
//     {
//       label: "Delete",
//       icon: Trash2,
//       onClick: (row) => {
//         // This will trigger the delete functionality in TableComponent
//         return row.original._id;
//       },
//       isDelete: true, // Flag to indicate this is a delete action
//     },
//   ];

//   return (
//     <div className="overflow-hidden">
//       {/* Header */}
//       <Box
//         sx={{
//           p: 3,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography variant="h6" fontWeight={600}>
//           Menu Management
//         </Typography>

//         <Button
//           variant="contained"
//           sx={{ backgroundColor: "#6F4E37" }}
//           startIcon={<Plus size={18} />}
//           onClick={() => navigate("/create-menu")}
//         >
//           Create Menu
//         </Button>
//       </Box>

//       {/* Table */}
//       <TableComponent
//         slug="menu"
//         columns={columns}
//         actions={actions}
//         actionsType="menu"
//         querykey="menu-list"
//         getApiEndPoint="MENU_LIST"
//         deleteApiEndPoint="MENU_DELETE"
//         deleteAction={true}
//         enableExportTable={true}
//       />
//     </div>
//   );
// };

// export default MenuList;


import TableComponent from "../TableComponent/TableComponent";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import { useMemo } from "react";
import { API_ROUTES } from "../../utils/api_constants";
import { APIRequest } from "../../utils/api_request";
import EditMenuModal from "./EditMenuModal";
import { useState } from "react";

const MenuList = () => {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
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
        Cell: ({ row }) => row.original.category?.name || "-",
      },
      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ row }) => `₹ ${row.original.price}`,
      },
    ],
    []
  );

  const actions = [
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => {
        navigate(`/menu/create-edit/${row.original._id}`);
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
          onClick={() => navigate("/create-menu")}
        >
          Create Menu
        </Button>
      </Box>

      {/* Table */}
      <TableComponent
        slug="menu"
        columns={columns}
        actions={actions}
        actionsType="menu"
        querykey="menu-list"
        getApiEndPoint="MENU_LIST"
        deleteApiEndPoint="MENU_DELETE"
        deleteAction={true}
        enableExportTable={true}
      />
    </div>
  );
};

export default MenuList;