import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import FormComponent from "../../components/forms/FormComponent";
import { useFetch, usePatch, usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import Loader from "../../components/common/Loader";
import { formatTime } from "../../utils/utils";
import { queryClient } from "../../lib/queryClient";

export default function AddEditAdmin() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useFetch(
        `user-${userId}`,
        `${API_ROUTES.getUserById}/${userId}`,
        {},
        {
            enabled: !!userId,
        },
    );

    const { mutate: updateMutate, isPending: updatePending } = usePatch(
        `${API_ROUTES.updateUsers}/${userId}`,
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: "get-users" });
                toast.success("User updated successfully");
                navigate("/cafes");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        },
    );

    const { mutate: createMutate, isPending: createPending } = usePost(
        API_ROUTES.createAdmins,
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: "get-users", type: "all", });
                toast.success("Admin created successfully");
                navigate("/cafes");
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || "Failed to create cafe");
            },
        },
    );

    const onSubmit = (data) => {
        delete data.__v;
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.id;

        const formattedData = {
            ...data,
            hours: {
                weekdays: `${formatTime(data.hours.weekdays.open)} - ${formatTime(
                    data.hours.weekdays.close
                )}`,
                weekends: `${formatTime(data.hours.weekends.open)} - ${formatTime(
                    data.hours.weekends.close
                )}`,
            },
        };

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

        if (userId) {
            updateMutate(formData);
        } else {
            createMutate(formData);
        }
    };

    if (isLoading) return <div><Loader variant="spinner" /></div>;

    return (
        <FormComponent
            onSubmit={onSubmit}
            isSubmitting={updatePending || createPending}
            {...(data?.result ? { defaultValues: data.result } : {})}
        />
    );
}
