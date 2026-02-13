import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { CheckCircle, QrCode } from "lucide-react";
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
        queryClient.invalidateQueries({ queryKey: ["getAdminLayouts"] });
        queryClient.invalidateQueries({ queryKey: [`layout-${layoutId}`] });
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
      onSuccess: (response) => {
        const newLayoutId = response?.result?._id || response?.result?.id;
        queryClient.invalidateQueries({ queryKey: ["getAdminLayouts"] });

        // Open success dialog with the new layout ID
        setSuccessDialog({
          open: true,
          layoutId: newLayoutId,
        });
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to create layout");
      },
    }
  );

  const isAdminEditing =
    layoutData?.defaultLayout === false && isAdmin && layoutId;

  const handleNavigateToQRGenerator = () => {
    setSuccessDialog({ open: false, layoutId: null });
    navigate("/qr-codes", { state: { layoutId: successDialog.layoutId } });
  };

  const preparePayload = (formValue, additionalFields = {}) => {
    const payload = { ...formValue, ...additionalFields };
    const hasFiles =
      formValue.homeImage instanceof File ||
      formValue.aboutImage instanceof File;

    if (hasFiles) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    }

    return payload;
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
        adminId: adminId,
        defaultLayoutId: layoutId,
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

      {/* Success Dialog */}
      <Dialog
        open={successDialog.open}
        onClose={() => {}} // Disable closing via backdrop or escape
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckCircle size={32} color="#10B981" />
            <Typography variant="h6" sx={{ color: "#6F4E37", fontWeight: 600 }}>
              Layout Created Successfully!
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
            Your layout has been created successfully. You can now generate QR
            codes for your tables.
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            QR codes will be associated with this layout and allow customers to
            access your menu.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, justifyContent: "center" }}>
          <Button
            onClick={handleNavigateToQRGenerator}
            variant="contained"
            startIcon={<QrCode size={18} />}
            sx={{
              backgroundColor: "#6F4E37",
              "&:hover": { backgroundColor: "#5A3D2B" },
            }}
          >
            Generate QR Codes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
