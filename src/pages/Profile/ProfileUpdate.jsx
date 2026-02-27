import { usePatch, useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { queryClient } from "../../lib/queryClient";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
// import Loader from "../../components/common/Loader";
import { Loader } from "../../components/common/Loader";
import SuperAdminProfileForm from "./SuperAdminProfileForm";
// import SuperAdminProfileForm from "./Superadminprofileform";


export function ProfileUpdate() {
    const navigate = useNavigate();

    // ✅ Get fresh logged-in user data
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
            onError: (error) =>
                toast.error(error?.message || "Update failed"),
        }
    );

    if (isLoading) {
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

    // ==============================
    // ✅ SUPER ADMIN PROFILE EDIT
    // ==============================
    if (role === "superadmin") {

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

        return (
            <SuperAdminProfileForm
                defaultValues={user || {}}
                onSubmit={onSubmit}
                isSubmitting={isPending}
                
            />
        );
    }

    return null;
}

// import { usePatch } from "../../utils/hooks/api_hooks";
// import { API_ROUTES } from "../../utils/api_constants";
// import { toast } from "react-hot-toast";
// import { useAuth } from "../../context/AuthContext";
// import { formatTime } from "../../utils/utils";
// import { FormComponent } from "../../components/forms/FormComponent";
// import { queryClient } from "../../lib/queryClient";
// import { useNavigate } from "react-router-dom";

// export function ProfileUpdate() {
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     const { mutate: updateMutate, isPending } = usePatch(
//         `${API_ROUTES.updateUsers}/${user?.id}`,
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: "get-me" });
//                 toast.success("Profile updated successfully");
//                 navigate("/dashboard");
//             },
//             onError: (error) => toast.error(error),
//         }
//     );

//     const onSubmit = (data) => {
//         delete data.__v;
//         delete data._id;
//         delete data.id;
//         delete data.isProfileComplete;
//         delete data.createdAt;
//         delete data.updatedAt;

//         const formattedData = {
//             ...data,
//             hours: {
//                 weekdays: `${formatTime(data.hours.weekdays.open)} - ${formatTime(data.hours.weekdays.close)}`,
//                 weekends: `${formatTime(data.hours.weekends.open)} - ${formatTime(data.hours.weekends.close)}`,
//             },
//         };

//         const formData = new FormData();
//         Object.entries(formattedData).forEach(([key, value]) => {
//             if (value !== null && value !== undefined) {
//                 if (typeof value === "object" && !(value instanceof File)) {
//                     formData.append(key, JSON.stringify(value));
//                 } else {
//                     formData.append(key, value);
//                 }
//             }
//         });

//         updateMutate(formData);
//     };

//     return (
//         <FormComponent
//             onSubmit={onSubmit}
//             isSubmitting={isPending}
//             defaultValues={user || {}}
//         />
//     );
// }

