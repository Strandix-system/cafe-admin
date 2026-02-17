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
import { queryClient } from '../../lib/queryClient'

const AddEditUser = ({ open, onClose, mode, data }) => {
    const isEdit = mode === "edit";

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            name: "",
            phoneNumber: "",
        },
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
    }, [isEdit, data, reset]);

    const { mutate: createUser, isPending: creating } = usePost(
        API_ROUTES.createCustomer,
        {
            onSuccess: () => {
                toast.success("User created successfully");

                queryClient.invalidateQueries({
                    queryKey: "get-cafe-users", // 🔥 THIS
                });
                  onClose(true);
                 refetch(); 
            },
        }
    );

    const { mutate: updateUser, isPending: updating } = usePatch(
        `${API_ROUTES.updateUser}/${data?._id}`,
        {
            onSuccess: () => {
                toast.success("User updated successfully");

                queryClient.invalidateQueries({
                    queryKey: "get-cafe-users", // 🔥 THIS
                });
                onClose(true);
                 refetch();                
            },
        }
    );

    const onSubmit = (formData) => {
        console.log("MODE:", mode);
        console.log("FORM DATA:", formData);
        isEdit ? updateUser(formData) : createUser(formData);
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={600}>
                {isEdit ? "Edit User" : "Create User"}
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Name"
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Phone Number"
                                        fullWidth
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => onClose(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={creating || updating}
                    >
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddEditUser;
