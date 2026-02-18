import { useEffect, useState } from "react";
import { Grid, Button, Box, Typography, Skeleton, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDelete, useFetch, usePatch } from "../utils/hooks/api_hooks";
import LayoutPreviewCard from "../components/layout/LayoutPreviewCard";
import { API_ROUTES } from "../utils/api_constants";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { queryClient } from "../lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";

export default function LayoutsPage() {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const [selectedDefaultLayout, setSelectedDefaultLayout] = useState(null);
  const [selectedAdminLayout, setSelectedAdminLayout] = useState(null);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [deleteLayoutId, setDeleteLayoutId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


  // Fetch default layouts (templates)
  const { data: defaultLayoutData, isLoading: isLoadingDefault } = useFetch(
    "getDefaultLayouts",
    API_ROUTES.getLayouts,
    { defaultLayout: true }, // SuperAdmin sees all, Admin sees only default templates
  );

  // Fetch admin's custom layouts (only for non-superAdmin)
  const { data: adminLayoutData, isLoading: isLoadingAdmin } = useFetch(
    "getAdminLayouts",
    API_ROUTES.getLayoutByAdmin,
    { adminId: user?.id },
    { enabled: isAdmin && !isSuperAdmin },
  );

  const { data: qrCodesData } = useFetch(
    "get-qr-codes",
    API_ROUTES.getQRCodes,
    { adminId: user?.id },
    {
      enabled: !!user?.id,
    }
  );

  const hasNoQR = qrCodesData?.result?.totalResults === 0 && adminLayoutData?.result?.totalResults === 1;

  const cafeQrId = adminLayoutData?.result?.cafeQr?._id;

  const { mutate: setActiveLayout, isPending: isSettingActive } = usePatch(
    `${API_ROUTES.setActiveLayout}`,
    {
      onSuccess: () => {
        toast.success("Active layout set successfully");
        queryClient.invalidateQueries({ queryKey: "getAdminLayouts" });
      },
      onError: (error) => {
        console.error("Error setting active layout:", error);
        toast.error("Failed to set active layout");
      },
    }
  );

  const defaultLayouts = defaultLayoutData?.result?.results || [];
  const adminLayouts = adminLayoutData?.result?.results || [];

  //delete my layouts
  const { mutate: deleteLayout, isPending: isDeleting } = useDelete(
    API_ROUTES.deleteLayoutbyAdmin, // make sure this exists
    {
      onSuccess: () => {
        toast.success("Layout deleted successfully");
       queryClient.invalidateQueries({ queryKey: "getAdminLayouts" });
        setOpenDeleteDialog(false);
        setDeleteLayoutId(null);
      },
      onError: () => {
        toast.error("Failed to delete layout");
      },
    }
  );

  const handleDelete = (layoutId) => {
    setDeleteLayoutId(layoutId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteLayoutId) return;
    deleteLayout(deleteLayoutId);
  };


  // Auto-select if only one default layout exists
  useEffect(() => {
    if (defaultLayouts.length === 1) {
      setSelectedDefaultLayout(defaultLayouts[0]._id);
    }
  }, [defaultLayouts]);

  const handlePreview = (layout) => {
    if (!layout?._id) {
      console.error("No valid layout ID for preview");
      return;
    }
    let url;
    if (layout.defaultLayout) {
      if (layout.layoutTitle === "COZZY") {
        url = `${import.meta.env.VITE_PORTFOLIO_URL}/${import.meta.env.VITE_COZZY_QR}`;
        window.open(url, "_blank");
      } else if (layout.layoutTitle === "ELEGANT") {
        url = `${import.meta.env.VITE_PORTFOLIO_URL}/${import.meta.env.VITE_ELEGANT_QR}`;
        window.open(url, "_blank");
      }
      return;
    }
    url = `${import.meta.env.VITE_PORTFOLIO_URL}/${cafeQrId}`;
    window.open(url, "_blank");
  };

  const handleEditAdmin = (layoutId) => {
    if (layoutId) {
      // For admin: edit their own layout
      navigate(`/layouts/create-edit/${layoutId}`);
    }
  };

  const handleCustomizeDefault = () => {
    if (selectedDefaultLayout) {
      // For superAdmin: edit the default layout directly
      navigate(`/layouts/create-edit/${selectedDefaultLayout}`);
    }
  };

  const handleSetActive = (layoutId) => {
    if (hasNoQR) {
      setOpenQrModal(true);
      return;
    }
    setActiveLayout({
      layoutId,
      active: true,
    });
  };

  useEffect(() => {
    if (hasNoQR) {
      setOpenQrModal(true);
    }
  }, [hasNoQR]);

  // SuperAdmin view
  if (isSuperAdmin) {
    return (
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          m={3}
        >
          <Typography variant="h5" fontWeight={700}>
            Default Layouts
          </Typography>

          <Button
            variant="contained"
            onClick={handleCustomizeDefault}
            disabled={!selectedDefaultLayout}
            sx={{ backgroundColor: "#6F4E37" }}
          >
            Customize
          </Button>
        </Box>

        <Grid container spacing={3} px={3}>
          {isLoadingDefault ? (
            Array.from(new Array(6)).map((_, index) => (
              <Grid item key={index}>
                <Skeleton
                  variant="rectangular"
                  width={260}
                  height={180}
                  sx={{ borderRadius: 3 }}
                />
                <Skeleton width={120} height={30} sx={{ mt: 1 }} />
              </Grid>
            ))
          ) : defaultLayouts.length > 0 ? (
            defaultLayouts.map((layout) => (
              <Grid item key={layout._id}>
                <LayoutPreviewCard
                  layout={layout}
                  isActive={false}
                  isSelected={selectedDefaultLayout === layout._id}
                  onSelect={setSelectedDefaultLayout}
                  onSetActive={() => { }}
                  onEdit={() => { }}
                  onPreview={handlePreview}
                  showEditButton={false}
                />
              </Grid>
            ))
          ) : (
            <Box width="100%" textAlign="center" mt={5}>
              <Typography variant="subtitle1" color="text.secondary">
                No default layouts found.
              </Typography>
            </Box>
          )}
        </Grid>
      </>
    );
  }

  // Admin view
  return (
    <div className="py-4">
      {/* Default Layouts Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m={3}
      >
        <Typography variant="h5" fontWeight={700}>
          Default Layouts
        </Typography>

        <Button
          variant="contained"
          onClick={handleCustomizeDefault}
          disabled={!selectedDefaultLayout}
          sx={{ backgroundColor: "#6F4E37" }}
        >
          Customize
        </Button>
      </Box>

      <Grid container spacing={3} px={3} mb={5}>
        {isLoadingDefault ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index}>
              <Skeleton
                variant="rectangular"
                width={260}
                height={180}
                sx={{ borderRadius: 3 }}
              />
              <Skeleton width={120} height={30} sx={{ mt: 1 }} />
            </Grid>
          ))
        ) : defaultLayouts.length > 0 ? (
          defaultLayouts.map((layout) => (
            <Grid item key={layout._id}>
              <LayoutPreviewCard
                layout={layout}
                isActive={false}
                isSelected={selectedDefaultLayout === layout._id}
                onSelect={setSelectedDefaultLayout}
                onSetActive={() => { }}
                onEdit={() => { }}
                onPreview={handlePreview}
                showEditButton={false}
              />
            </Grid>
          ))
        ) : (
          <Box width="100%" textAlign="center" mt={5}>
            <Typography variant="subtitle1" color="text.secondary">
              No default layouts found.
            </Typography>
          </Box>
        )}
      </Grid>

      <Divider sx={{ mx: 3, my: 4 }} />

      {/* Admin's Custom Layouts Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m={3}
      >
        <Typography variant="h5" fontWeight={700}>
          My Layouts
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        px={3}
        sx={{ opacity: hasNoQR ? 0.5 : 1, pointerEvents: hasNoQR ? "none" : "auto" }}
      >
        {isLoadingAdmin ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index}>
              <Skeleton
                variant="rectangular"
                width={260}
                height={180}
                sx={{ borderRadius: 3 }}
              />
              <Skeleton width={120} height={30} sx={{ mt: 1 }} />
            </Grid>
          ))
        ) : adminLayouts.length > 0 ? (
          adminLayouts.map((layout) => (
            <Grid item key={layout._id}>
              <LayoutPreviewCard
                layout={layout}
                isActive={layout?.active}
                isSelected={selectedAdminLayout === layout._id}
                onSelect={setSelectedAdminLayout}
                onSetActive={handleSetActive}
                onEdit={handleEditAdmin}
                onPreview={handlePreview}
                showEditButton={true}
                onDelete={handleDelete}
                showDeleteButton
              />
            </Grid>
          ))
        ) : (
          <Box width="100%" textAlign="center" mt={5}>
            <Typography variant="subtitle1" color="text.secondary">
              No custom layouts yet. Customize a default layout to get started!
            </Typography>
          </Box>
        )}
      </Grid>

      {hasNoQR && <Dialog
        open={openQrModal}
        disableEscapeKeyDown
        onClose={() => { }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 420,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          QR Code Required
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You haven’t created any QR codes for your cafe tables yet.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Without QR codes, none of the created layouts will work.
            Please create QR codes first to activate and use layouts
            properly.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#6F4E37" }}
            onClick={() => navigate("/table-management")}
          >
            Create QR Codes
          </Button>
        </DialogActions>
      </Dialog>}

      <Dialog
        open={openDeleteDialog}
        onClose={() => !isDeleting && setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 420,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Delete Layout?
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this layout?
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
