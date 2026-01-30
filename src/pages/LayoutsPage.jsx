import { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { useFetch } from "../utils/hooks/api_hooks";
import CreateLayoutDialog from "../components/layouts/CreateLayoutDialog";
import LayoutCard from "../components/layouts/LayoutCard";
import LayoutPreviewDialog from "../components/layouts/LayoutPreviewDialog";
import { API_ROUTES } from "../utils/api_constants";

export default function LayoutsPage() {
  const { data, isLoading } = useFetch("layouts", API_ROUTES.getLayouts);
  const [openCreate, setOpenCreate] = useState(false);
  const [previewLayout, setPreviewLayout] = useState(null);

  const layouts = data?.data || [];

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Layout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {layouts.map((layout) => (
          <Grid item xs={12} md={4} key={layout.id}>
            <LayoutCard
              layout={layout}
              onPreview={setPreviewLayout}
            />
          </Grid>
        ))}
      </Grid>

      <CreateLayoutDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <LayoutPreviewDialog
        open={!!previewLayout}
        layout={previewLayout}
        onClose={() => setPreviewLayout(null)}
      />
    </>
  );
}
