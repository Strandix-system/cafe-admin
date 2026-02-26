import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { usePatch, usePost, usePut } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { loginSchema } from "../../utils/validation";
import { queryClient } from "../../lib/queryClient";
import { useAuth } from "../../context/AuthContext";
import { CommonButton } from "../../components/common/commonButton";
import { CommonTextField } from "../../components/common/CommonTextField";

export const AddEditUser = ({ open, onClose, mode, data }) => {
  const isEdit = mode === "edit";
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
    mode: "all",
  });

    /* 🔹 Fill form on edit */
    useEffect(() => {
        if (isEdit && data) {
            reset({
                name: data.name,
                phoneNumber: data.phoneNumber,
            });
        } else {
            reset({ name: "", phoneNumber: "" });
        }
    }, [isEdit, data, reset, open]);

  const { mutate: createUser, isPending: creating } = usePost(
    API_ROUTES.createCustomer,
    {
      onSuccess: () => {
        toast.success("User created successfully");

        queryClient.invalidateQueries({
          queryKey: ["get-cafe-users"], // 🔥 THIS
        });
        onClose(true);
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const { mutate: updateUser, isPending: updating } = usePatch(
    `${API_ROUTES.updateUser}/${data?._id}`,
    {
      onSuccess: () => {
        toast.success("User updated successfully");
        queryClient.invalidateQueries({ queryKey: ["get-cafe-users"] });
        onClose(true);
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      adminId: isEdit
        ? data?.adminId || data?.createdBy // edit case (keep existing)
        : user?.id, // create case (logged-in admin)
    };

    isEdit ? updateUser(payload) : createUser(payload);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={600}>
        {isEdit ? "Edit User" : "Create User"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <CommonTextField
              name="name"
              label="Full Name"
              placeholder="Enter full name"
              control={control}
              errors={errors}
              gridSize={{ xs: 12 }}
            />

            <CommonTextField
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter phone number"
              control={control}
              errors={errors}
              gridSize={{ xs: 12 }}
              type="tel"
            />
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <CommonButton
            variant="outlined"
            onClick={() => onClose(false)}
            disabled={creating || updating}
          >
            Cancel
          </CommonButton>

          <CommonButton
            type="submit"
            variant="contained"
            loading={creating || updating}
            disabled={!isValid}
          >
            {isEdit ? "Update" : "Create"}
          </CommonButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
