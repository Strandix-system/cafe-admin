import { usePatch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { formatTime } from "../../utils/utils";
import { FormComponent } from "../../components/forms/FormComponent";
import SuperAdminProfileForm from "./SuperAdminProfileForm";
import { queryClient } from "../../lib/queryClient";
import { useNavigate } from "react-router-dom";
import { AUTH_ROLES } from "../../utils/constant";

export function ProfileUpdate() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { mutate: updateMutate, isPending } = usePatch(
        `${API_ROUTES.updateUsers}/${user?.id}`,
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: "get-me" });
                toast.success("Profile updated successfully");
                navigate("/dashboard");
            },
            onError: (error) =>
                toast.error(error?.message || "Update failed"),
        }
    );

    const onSubmit = (data) => {
        delete data.__v;
        delete data._id;
        delete data.id;
        delete data.isProfileComplete;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.role;

        const formattedData = {
            ...data,
            hours: {
                weekdays:
                    data?.hours?.weekdays?.open &&
                        data?.hours?.weekdays?.close
                        ? `${formatTime(data.hours.weekdays.open)} - ${formatTime(
                            data.hours.weekdays.close
                        )}`
                        : "",
                weekends:
                    data?.hours?.weekends?.open &&
                        data?.hours?.weekends?.close
                        ? `${formatTime(data.hours.weekends.open)} - ${formatTime(
                            data.hours.weekends.close
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

    if (!user) return undefined;

    if (user.role === AUTH_ROLES.SUPER_ADMIN) {
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