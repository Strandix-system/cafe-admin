import Loader from "../../components/common/Loader";
import LayoutForm from "../../components/layout/LayoutForm";
import { useAuth } from "../../context/AuthContext";
import { queryClient } from "../../lib/queryClient";
import { API_ROUTES } from "../../utils/api_constants";
import { useFetch, usePatch, usePost } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function AddEditLayout() {
    const { layoutId } = useParams();
    const { isSuperAdmin, isAdmin, adminId } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: { result: layoutData } = {}, isLoading } = useFetch(
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
                queryClient.invalidateQueries({ queryKey: ["getAdminLayouts"] });
                queryClient.invalidateQueries({ queryKey: [`layout-${layoutId}`] });
                toast.success("Layout updated successfully");
                navigate("/layouts");
            },
            onError: (err) => {
                toast.error(err?.message || "Failed to update layout");
            },
        },
    );

    const { mutate: createLayoutMutate, isPending: createPending } = usePost(
        API_ROUTES.createLayout,
        {
            onSuccess: () => {
                toast.success("Layout created successfully");
                queryClient.invalidateQueries({ queryKey: ["getAdminLayouts"] });
                navigate("/layouts");
            },
            onError: (err) => {
                toast.error(err?.message || "Failed to create layout");
            },
        },
    );

    const isAdminEditing = layoutData?.defaultLayout === false && isAdmin && layoutId;

    const onSubmit = (formValue) => {
        // SuperAdmin editing existing default layout
        if (layoutId && isSuperAdmin && !isAdminEditing) {
            const payload = {
                ...formValue,
                defaultLayout: true, // Boolean
            };

            // Check if there are file uploads
            const hasFiles = formValue.homeImage instanceof File || formValue.aboutImage instanceof File;

            if (hasFiles) {
                // Use FormData only if there are new images
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else if (typeof value === 'object' && value !== null) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                });
                updateLayoutMutate(formData);
            } else {
                // Send as JSON if no new images
                updateLayoutMutate(payload);
            }
        }
        // Admin creating from template
        else if (isAdmin && layoutId) {
            const payload = {
                ...formValue,
                adminId: adminId,
                defaultLayoutId: layoutId,
                defaultLayout: false,
            };

            const hasFiles = formValue.homeImage instanceof File || formValue.aboutImage instanceof File;

            if (hasFiles) {
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else if (typeof value === 'object' && value !== null) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                });
                createLayoutMutate(formData);
            } else {
                createLayoutMutate(payload);
            }
        }
        // Admin editing their own layout
        else if (isAdminEditing) {
            const hasFiles = formValue.homeImage instanceof File || formValue.aboutImage instanceof File;

            if (hasFiles) {
                const formData = new FormData();
                Object.entries(formValue).forEach(([key, value]) => {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else if (typeof value === 'object' && value !== null) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                });
                updateLayoutMutate(formData);
            } else {
                updateLayoutMutate(formValue);
            }
        }
    };

    // Prepare default values based on context
    const getDefaultValues = () => {
        if (!layoutData) return undefined;

        // If creating from template, strip out metadata
        if (isAdmin && layoutId && !isAdminEditing) {
            const {
                _id,
                id,
                createdAt,
                updatedAt,
                adminId,
                defaultLayout,
                defaultLayoutId,
                __v,
                ...templateData
            } = layoutData;

            return {
                layoutTitle: `${layoutData.layoutTitle}`,
                homeImage: null,
                aboutImage: null,
                menuTitle: "",
                aboutTitle: "",
                aboutDescription: "",
                cafeDescription: "",
                hours: {
                    weekdays: "",
                    weekends: "",
                },
                socialLinks: {
                    instagram: "",
                    facebook: "",
                    twitter: "",
                },
            };
        }
        // Normal edit - return as is
        return layoutData;

    };

    if (!layoutId) {
        navigate("/layouts");
        return null;
    }

    if (isLoading) {
        return (
            <div>
                <Loader variant="spinner" />
            </div>
        );
    }

    return (
        <LayoutForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            isSubmitting={updatePending || createPending}
            defaultValues={getDefaultValues()}
            isAdmin={isAdmin}
        />
    );
}