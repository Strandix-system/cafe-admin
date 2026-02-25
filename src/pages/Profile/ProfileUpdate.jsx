import { usePatch, useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { toast } from "react-hot-toast";
import { formatTime } from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import { queryClient } from "../../lib/queryClient";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import FormComponent from "../../components/forms/FormComponent";
import Loader from "../../components/common/Loader";

export default function ProfileUpdate() {
    const navigate = useNavigate();

    // ✅ Always get fresh data from ME API
    const { data, isLoading } = useFetch("get-me", API_ROUTES.getMe);
    const user = data?.result;
    const role = user?.role;

    const { mutate: updateMutate, isPending } = usePatch(
        `${API_ROUTES.updateUsers}/${user?.id}`,
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["get-me"] });
                toast.success("Profile updated successfully");
                navigate("/dashboard");
            },
            onError: (error) => toast.error(error?.message || "Update failed"),
        }
    );

    // ✅ Show loader while fetching
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Loader variant="spinner" />
            </Box>
        );
    }

    // ==============================
    // ✅ SUPERADMIN VIEW (NO FORM)
    // ==============================
    if (role === "superadmin") {
        return (
            <Paper sx={{ p: 4, maxWidth: 500 }}>
                <Typography variant="h6" gutterBottom>
                    Super Admin Profile
                </Typography>

                <Typography variant="body1">
                    <strong>Email:</strong> {user?.email}
                </Typography>
            </Paper>
        );
    }

    // ==============================
    // ✅ ADMIN VIEW (WITH FORM)
    // ==============================
    const onSubmit = (data) => {
        const cleaned = { ...data };

        delete cleaned.__v;
        delete cleaned._id;
        delete cleaned.id;
        delete cleaned.createdAt;
        delete cleaned.updatedAt;

        // const formattedData = {
        //     ...cleaned,
        //     hours: {
        //         weekdays: `${formatTime(data.hours.weekdays.open)} - ${formatTime(data.hours.weekdays.close)}`,
        //         weekends: `${formatTime(data.hours.weekends.open)} - ${formatTime(data.hours.weekends.close)}`,
        //     },
        // };

        const formData = new FormData();

        Object.entries(formattedData).forEach(([key, value]) => {
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

    return (
        <FormComponent
            onSubmit={onSubmit}
            isSubmitting={isPending}
            defaultValues={user || {}}
        />
    );
}