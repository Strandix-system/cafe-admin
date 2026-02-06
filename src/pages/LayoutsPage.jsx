import { useEffect, useState } from "react";
import { Grid, Button, Box, Typography } from "@mui/material";
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
    { enabled: isSuperAdmin }
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
    navigate(`/layouts/preview/${layout._id}`);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" m={3}>
        <Typography variant="h5" fontWeight={700}>
          Layouts
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/layouts/create-edit")}
          sx={{ backgroundColor: "#6F4E37" }}
        >
          + Create Layout
        </Button>
      </Box>

      <Grid container spacing={3} px={3}>
        {layouts.map((layout) => (
          <Grid item key={layout._id}>
            <LayoutPreviewCard
              layout={layout}
              selectedId={selectedLayout}
              onSelect={setSelectedLayout}
              onPreview={handlePreview}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
