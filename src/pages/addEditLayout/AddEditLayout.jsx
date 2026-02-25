import { useState } from "react";
import Loader from "../../components/common/Loader";
import LayoutForm from "../../components/layout/LayoutForm";
import { useAuth } from "../../context/AuthContext";
import { queryClient } from "../../lib/queryClient";
import { API_ROUTES } from "../../utils/api_constants";
import { useFetch, usePatch, usePost } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function AddEditLayout() {
  const { layoutId } = useParams();
  const { isSuperAdmin, isAdmin, adminId } = useAuth();
  const navigate = useNavigate();
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    layoutId: null,
  });

  const { data: { result: layoutData } = {}, isLoading } = useFetch(
    `layout-${layoutId}`,
    `${API_ROUTES.getLayoutById}/${layoutId}`,
    {},
    {
      enabled: !!layoutId,
    }
  );

  const { mutate: updateLayoutMutate, isPending: updatePending } = usePatch(
    `${API_ROUTES.updateLayout}/${layoutId}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: "getAdminLayouts" });
        queryClient.invalidateQueries({ queryKey: `layout-${layoutId}` });
        toast.success("Layout updated successfully");
        navigate("/layouts");
      },
      onError: (error) => {
        toast.error(error );
      },
    }
  );

  const { mutate: createLayoutMutate, isPending: createPending } = usePost(
    API_ROUTES.createLayout,
    {
      onSuccess: (response) => {
        const newLayoutId = response?.result?._id || response?.result?.id;
        queryClient.invalidateQueries({ queryKey: "getAdminLayouts" });

        // Open success dialog with the new layout ID
        setSuccessDialog({
          open: true,
          layoutId: newLayoutId,
        });
        navigate("/layouts")
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const isAdminEditing =
    layoutData?.defaultLayout === false && isAdmin && layoutId;

  const preparePayload = (formValue, additionalFields = {}) => {
    const payload = { ...formValue, ...additionalFields };

    const hasFiles =
      formValue.homeImage instanceof File ||
      formValue.aboutImage instanceof File;

    if (!hasFiles) return payload;

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined) return;

      if (key === "adminId") {
        formData.append("adminId", String(value?._id || value));
        return;
      }

      if (key === "defaultLayoutId") {
        if (value) {
          formData.append("defaultLayoutId", String(value));
        }
        return;
      }

      // Files
      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      // Objects (hours, socialLinks etc.)
      if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      // Primitives
      formData.append(key, value);
    });

    return formData;
  };


  const onSubmit = (formValue) => {
    // Admin editing their own layout
    if (isAdminEditing) {
      const payload = preparePayload(formValue);
      updateLayoutMutate(payload);
    }
    // SuperAdmin editing existing default layout
    else if (layoutId && isSuperAdmin) {
      const payload = preparePayload(formValue, { defaultLayout: true });
      updateLayoutMutate(payload);
    }
    // Admin creating from template
    else if (isAdmin && layoutId) {
      const payload = preparePayload(formValue, {
        adminId: String(adminId),
        defaultLayoutId: layoutId || null,
        defaultLayout: false,
      });
      createLayoutMutate(payload);
    }
  };

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
        gst: ""
      };
    }

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
    <>
      <LayoutForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        isSubmitting={updatePending || createPending}
        defaultValues={getDefaultValues()}
        isAdmin={isAdmin}
      />
    </>
  );
}
