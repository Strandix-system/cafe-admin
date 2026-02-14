import { useEffect, useState } from "react";
import { Grid, Button, Box, Typography, Skeleton, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch, usePatch } from "../utils/hooks/api_hooks";
import LayoutPreviewCard from "../components/layout/LayoutPreviewCard";
import { API_ROUTES } from "../utils/api_constants";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { queryClient } from "../lib/queryClient";

export default function LayoutsPage() {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const [selectedDefaultLayout, setSelectedDefaultLayout] = useState(null);
  const [selectedAdminLayout, setSelectedAdminLayout] = useState(null);

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

  const activeLayoutId = adminLayoutData?.result?.results.find(layout => layout.isActive)?._id;

  const { mutate: setActiveLayout, isPending: isSettingActive } = usePatch(
    `${API_ROUTES.setActiveLayout}`,
    {
      onSuccess: () => {
        toast.success("Active layout set successfully");
        queryClient.invalidateQueries({ queryKey: ["getAdminLayouts"] });
      },
      onError: (error) => {
        console.error("Error setting active layout:", error);
        toast.error("Failed to set active layout");
      },
    }
  );

  const defaultLayouts = defaultLayoutData?.result?.results || [];
  const adminLayouts = adminLayoutData?.result?.results || [];

  // Auto-select if only one default layout exists
  useEffect(() => {
    if (defaultLayouts.length === 1) {
      setSelectedDefaultLayout(defaultLayouts[0]._id);
    }
  }, [defaultLayouts]);

  // Auto-select if only one admin layout exists
  // useEffect(() => {
  //   if (adminLayouts.length === 1 && !isSuperAdmin) {
  //     setSelectedAdminLayout(adminLayouts[0]._id);
  //   }
  // }, [adminLayouts, isSuperAdmin]);

  const handlePreview = (layout) => {
    if (!layout?._id) {
      console.error("No valid layout ID for preview");
      return;
    }
    const url = `${import.meta.env.VITE_PORTFOLIO_URL}/${layout?._id}`;
    window.open(url, "_blank");
  };

  const handleEditAdmin = () => {
    if (selectedAdminLayout) {
      // For admin: edit their own layout
      navigate(`/layouts/create-edit/${selectedAdminLayout}`);
    }
  };

  const handleCustomizeDefault = () => {
    if (selectedDefaultLayout) {
      // For superAdmin: edit the default layout directly
      navigate(`/layouts/create-edit/${selectedDefaultLayout}`);
    }
  };

  const handleSetActive = (layoutId) => {
    setActiveLayout({
      layoutId,
      active: true,
    });
  };

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

        <Button
          variant="contained"
          onClick={handleEditAdmin}
          disabled={!selectedAdminLayout}
          sx={{ backgroundColor: "#6F4E37" }}
        >
          Edit
        </Button>
      </Box>

      <Grid container spacing={3} px={3}>
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
                isActive={layout._id === activeLayoutId}
                isSelected={selectedAdminLayout === layout._id}
                onSelect={setSelectedAdminLayout}
                onSetActive={handleSetActive}
                onEdit={handleEditAdmin}
                onPreview={handlePreview}
                showEditButton={true}
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
    </div>
  );
}