import { usePatch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { formatTime } from "../../utils/utils";
import { FormComponent } from "../../components/forms/FormComponent";
import SuperAdminProfileForm from "./SuperAdminProfileForm";
import { queryClient } from "../../lib/queryClient";
import { useNavigate } from "react-router-dom";

export function ProfileUpdate() {
    const { user } = useAuth();
    const navigate = useNavigate();

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

    const onSubmit = (data) => {

        delete cleaned.__v;
        delete cleaned._id;
        delete cleaned.id;
        delete cleaned.isProfileComplete;
        delete cleaned.createdAt;
        delete cleaned.updatedAt;
        delete cleaned.role;

        const formattedData = {
            hours: {
                weekdays:
                    cleaned?.hours?.weekdays?.open &&
                        cleaned?.hours?.weekdays?.close
                        ? `${formatTime(cleaned.hours.weekdays.open)} - ${formatTime(
                            cleaned.hours.weekdays.close
                        )}`
                        : "",
                weekends:
                    cleaned?.hours?.weekends?.open &&
                        cleaned?.hours?.weekends?.close
                        ? `${formatTime(cleaned.hours.weekends.open)} - ${formatTime(
                            cleaned.hours.weekends.close
                        )}`
                        : "",
            },
        };

        const formData = new FormData();

        Object.entries(formattedData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === "object") {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        updateMutate(formData);
    };

    if (!user) return null;

    if (user.role === "superadmin") {
        return (
            <SuperAdminProfileForm
                onSubmit={onSubmit}
                isSubmitting={isPending}
                defaultValues={user}
            />
        );
    }

    return (
        <FormComponent
            onSubmit={onSubmit}
            isSubmitting={isPending}
            defaultValues={user}
        />
    );
}