import Loader from "../../components/common/Loader";
import LayoutForm from "../../components/layout/LayoutForm";
import { queryClient } from "../../lib/queryClient";
import { API_ROUTES } from "../../utils/api_constants";
import { useFetch, usePatch, usePost } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function AddEditLayout() {

    const { layoutId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useFetch(
        `layout-${layoutId}`,
        `${API_ROUTES.getLayoutById}/${layoutId}`,
        {},
        {
            enabled: !!layoutId,
        },
    );

    const { mutate: updateLayoutMutate, isPending: updatePending } = usePatch(
        `${API_ROUTES.updateLayout}/${layoutId}`,
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getLayouts"] });
                toast.success("Layout updated successfully");
                navigate("/layouts");
            },
            onError: (err) => {
                toast.error(err?.message || "Failed to update layout");
            },
        }
    );

    const { mutate: createLayoutMutate, isPending: createPending } = usePost(
        API_ROUTES.createLayout,
        {
            onSuccess: () => {
                toast.success("Layout created successfully");
                queryClient.invalidateQueries({ queryKey: ["getLayouts"] });
                navigate("/layouts");
            },
            onError: (err) => {
                toast.error(err?.message || "Failed to create layout");
            }
        }
    );

    const onSubmit = (data) => {
        if (layoutId) {
            updateLayoutMutate(data);
        }
        else {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });
            createLayoutMutate(data);
        }
    };

    if (isLoading) return <div><Loader variant="spinner" /></div>;

    return (
        <LayoutForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            isSubmitting={updatePending || createPending}
            {...(data?.result ? { defaultValues: data.result } : {})}
        />
    );

}