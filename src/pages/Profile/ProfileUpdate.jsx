import { usePatch, useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { toast } from "react-hot-toast";
import { queryClient } from "../../lib/queryClient";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Loader } from "../../components/common/Loader";
import SuperAdminProfileForm from "./SuperAdminProfileForm";
import { FormComponent } from "../../components/forms/FormComponent";

export function ProfileUpdate() {
    const navigate = useNavigate();

    // Fetch logged-in user
    const { data, isLoading } = useFetch("get-me", API_ROUTES.getMe);
    const user = data?.result;
    const role = user?.role;

    // Update mutation
    const { mutate: updateMutate, isPending } = usePatch(
        user?.id ? `${API_ROUTES.updateUsers}/${user.id}` : null,
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["get-me"] });
                toast.success("Profile updated successfully");
                navigate("/dashboard");
            },
            onError: (error) =>
                toast.error(error?.message || "Update failed"),
        }
    );

    // Loading state
    if (isLoading || !user) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <Loader variant="spinner" />
            </Box>
        );
    }

    // Common submit handler (for both roles)
    const onSubmit = (formDataValues) => {
        const cleaned = { ...formDataValues };

        delete cleaned.__v;
        delete cleaned._id;
        delete cleaned.id;
        delete cleaned.createdAt;
        delete cleaned.updatedAt;

        const formData = new FormData();

        Object.entries(cleaned).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (typeof value === "object" && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        updateMutate(formData);
    };

    // Role-based rendering
    if (role === "admin") {
        return (
            <FormComponent
                defaultValues={user}
                onSubmit={onSubmit}
                isSubmitting={isPending}
            />
        );
    }

    if (role === "superadmin") {
        return (
            <SuperAdminProfileForm
                defaultValues={user}
                onSubmit={onSubmit}
                isSubmitting={isPending}
            />
        );
    }

    return null;
}