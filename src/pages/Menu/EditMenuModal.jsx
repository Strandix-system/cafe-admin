import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { APIRequest } from "../../utils/api_request";
import { API_ROUTES } from "../../utils/api_constants";
import {CommonButton} from "../../components/common/commonButton";

export const EditMenuModal = ({ open, onClose, menuId, onSuccess }) => {
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

