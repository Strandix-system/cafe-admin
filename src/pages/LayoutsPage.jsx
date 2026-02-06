import { useState } from "react";
import { Grid, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../utils/hooks/api_hooks";
import LayoutCard from "../components/layout/LayoutCard";
import { API_ROUTES } from "../utils/api_constants";
import { queryClient } from "../lib/queryClient";
import { useAuth } from "../context/AuthContext"

export default function LayoutsPage() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();

  const { data: { data: { result: { results: layouts = [] } = {} } = {} } = {}, isLoading } = useFetch("getLayouts", API_ROUTES.getLayouts,
    {
      defaultLayout: isSuperAdmin,
    },
    {
      enabled: isSuperAdmin
    }
  );

  console.log(layouts);

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
          onClick={() => navigate("/layouts/create-edit")}
          sx={{ backgroundColor: "#6F4E37" }}
        >
          + Create Layout
        </Button>
      </Box>

      {/* <Grid container spacing={3}>
        {layouts && (
          <Grid item xs={12} md={4} key={layout._id}>
            <LayoutCard
              layout={layouts}
              portfolioUrl="https://your-portfolio-link.com"
              onEdit={() => navigate(`/layouts/create-edit/${layout._id}`)}
              onDelete={() => {
                queryClient.invalidateQueries({ queryKey: ["getLayouts"] });

              }}
            />
          </Grid>
        )}
      </Grid> */}
    </>
  );
}
