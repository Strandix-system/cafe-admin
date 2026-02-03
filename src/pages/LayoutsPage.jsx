import { useState } from "react";
import { Grid, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../utils/hooks/api_hooks";
import LayoutCard from "../components/layouts/LayoutCard";
import { API_ROUTES } from "../utils/api_constants";
import { queryClient } from "../lib/queryClient";

export default function LayoutsPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useFetch("getLayouts", API_ROUTES.getLayouts);
  const [previewLayout, setPreviewLayout] = useState(null);

  const layouts = data?.data || [];

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={700}>
          Layouts
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/layouts/create")}
        >
          + Create Layout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {layouts.map((layout) => (
          <Grid item xs={12} md={4} key={layout.id}>
            <LayoutCard
              layout={layout}
              onPreview={setPreviewLayout}
              onDelete={() => {
                // After delete, refresh list
                queryClient.invalidateQueries({queryKey:["getLayouts"]});
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
