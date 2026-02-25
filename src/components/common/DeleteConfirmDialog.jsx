import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import CommonButton from "./commonButton";


export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  slug = "item",
  name = "",
  loading = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete {slug}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete this {slug}
          {name && ` (${name})`}?
        </Typography>
      </DialogContent>

      <DialogActions>
        {/* <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button> */}
        <CommonButton
          variant="outlined"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </CommonButton>

        <CommonButton
          onClick={onConfirm}
          loading={loading}
          bgColor="#d32f2f"        // MUI error red
          hoverColor="#b71c1c"
        >
          Delete
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
};












