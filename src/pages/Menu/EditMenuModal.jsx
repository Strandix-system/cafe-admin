import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { APIRequest } from "../../utils/api_request";
import { API_ROUTES } from "../../utils/api_constants";

const EditMenuModal = ({ open, onClose, menuId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    discountPrice: "",
    description: "",
  });

  // 🔹 Fetch menu details
  useEffect(() => {
    if (!menuId) return;

    const fetchMenu = async () => {
      const res = await APIRequest.get(
        API_ROUTES.MENU_BY_ID.replace(":id", menuId)
      );
      setFormData({
        name: res.data.name,
        category: res.data.category?._id,
        price: res.data.price,
        discountPrice: res.data.discountPrice || "",
        description: res.data.description,
      });
    };

    fetchMenu();
  }, [menuId]);

  // 🔹 Update menu
  const handleSubmit = async () => {
    await APIRequest.patch(
      API_ROUTES.MENU_UPDATE.replace(":id", menuId),
      formData
    );
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Menu</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Item Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <TextField
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
        />

        <TextField
          label="Discount Price"
          type="number"
          value={formData.discountPrice}
          onChange={(e) =>
            setFormData({ ...formData, discountPrice: e.target.value })
          }
        />

        <TextField
          label="Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </DialogContent>

      <DialogActions>
        {/* <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button> */}
        <CommonButton  variant="outlined" onClick={onClose} >
    Cancel
  </CommonButton>

  <CommonButton
    variant="contained"
    onClick={handleSubmit}
  >
    Update
  </CommonButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditMenuModal;


// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { APIRequest } from "../../utils/api_request";
// import { API_ROUTES } from "../../utils/api_constants";

// const EditUserModal = ({ open, onClose, userId, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     tableNumber: "",
//   });

//   // 🔹 Fetch user details
//   useEffect(() => {
//     if (!userId || !open) return;

//     const fetchUser = async () => {
//       try {
//         const res = await APIRequest.get(
//           API_ROUTES.USER_BY_ID.replace(":id", userId)
//         );

//         setFormData({
//           name: res.data.name || "",
//           phone: res.data.phone || "",
//           tableNumber: res.data.tableNumber || "",
//         });
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//       }
//     };

//     fetchUser();
//   }, [userId, open]);

//   // 🔹 Update user
//   const handleSubmit = async () => {
//     try {
//       await APIRequest.patch(
//         API_ROUTES.USER_UPDATE.replace(":id", userId),
//         formData
//       );

//       onSuccess(); // refresh table
//       onClose();
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Edit User</DialogTitle>

//       <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         <TextField
//           label="Name"
//           value={formData.name}
//           onChange={(e) =>
//             setFormData({ ...formData, name: e.target.value })
//           }
//         />

//         <TextField
//           label="Phone"
//           type="tel"
//           value={formData.phone}
//           onChange={(e) =>
//             setFormData({ ...formData, phone: e.target.value })
//           }
//         />

//         <TextField
//           label="Table Number"
//           type="number"
//           value={formData.tableNumber}
//           onChange={(e) =>
//             setFormData({ ...formData, tableNumber: e.target.value })
//           }
//         />
//         <TableComponent
        
//         columns={columns}
//         actions={actions}
//         params={{
//         populate: "category",
//         }}
//         //  params={{
//         //     populate: "Discount ",
//         // }}
//         actionsType="menu"
//         querykey="menu-list"
//         getApiEndPoint="MENU_LIST"
//         deleteApiEndPoint={API_ROUTES.MENU_DELETE}
//         deleteAction={true}
//         enableExportTable={true}
//       />
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit}>
//           Update
//         </Button>
//       </DialogActions>
      

//     </Dialog>

    
//   );
// };

// export default EditUserModal;

