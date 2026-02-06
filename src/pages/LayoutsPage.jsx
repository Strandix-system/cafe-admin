import { useEffect, useState } from "react";
import { Grid, Button, Box, Typography, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../utils/hooks/api_hooks";
import LayoutPreviewCard from "../components/layout/LayoutPreviewCard";
import { API_ROUTES } from "../utils/api_constants";
import { useAuth } from "../context/AuthContext";

export default function LayoutsPage() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();

  const { data, isLoading } = useFetch(
    "getLayouts",
    API_ROUTES.getLayouts,
    { defaultLayout: isSuperAdmin },
    { enabled: isSuperAdmin },
  );

  const layouts = data?.result?.results || [];

  const [selectedLayout, setSelectedLayout] = useState(null);

  // Auto-select if only one layout exists
  useEffect(() => {
    if (layouts.length === 1) {
      setSelectedLayout(layouts[0]._id);
    }
  }, [layouts]);

  const handlePreview = (layout) => {
    console.log(layout);
    const url = `${import.meta.env.VITE_PORTFOLIO_URL}/${layout?.previewToken}`;
    window.open(url, "_blank"); // opens in a new tab
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m={3}
      >
        <Typography variant="h5" fontWeight={700}>
          Layouts
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(`/layouts/create-edit/${selectedLayout}`)}
          sx={{ backgroundColor: "#6F4E37" }}
        >
          Customize
        </Button>
      </Box>

      <Grid container spacing={3} px={3}>
        {isLoading ? (
          // Show skeletons while loading
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
        ) : layouts.length > 0 ? (
          layouts.map((layout) => (
            <Grid item key={layout._id}>
              <LayoutPreviewCard
                layout={layout}
                selectedId={selectedLayout}
                onSelect={setSelectedLayout}
                onPreview={handlePreview}
              />
            </Grid>
          ))
        ) : (
          <Box width="100%" textAlign="center" mt={5}>
            <Typography variant="subtitle1" color="text.secondary">
              No layouts found.
            </Typography>
          </Box>
        )}
      </Grid>
    </>
  );
}
