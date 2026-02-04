import toast from "react-hot-toast";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontIcon from "@mui/icons-material/Storefront";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePost, useFetch } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../lib/queryClient";
import { useAuth } from "../context/AuthContext";
import * as yup from "yup";

/* ================= VALIDATION ================= */
const layoutSchema = yup.object({
  layoutTitle: yup.string().required("Layout title is required"),

  homeImage: yup
    .mixed()
    .required("Home image is required")
    .test(
      "fileType",
      "Only image files allowed",
      (value) =>
        !value ||
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          value.type
        )
    ),

  menuTitle: yup
    .string()
    .trim()
    .min(3, "Menu title must be at least 3 characters")
    .required("Menu title is required"),

  aboutImage: yup.mixed().required("About image is required"),

  aboutTitle: yup
    .string()
    .trim()
    .min(3, "About title is required")
    .required("About title is required"),

  aboutDescription: yup.string().required("About description is required"),
  cafeDescription: yup.string().required("Cafe description is required"),
});

export default function CreateLayoutPage() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();

  const { mutate: createLayout, isPending } = usePost(
    API_ROUTES.createLayout,
    {
      onSuccess: () => {
        toast.success("Layout created successfully");
        queryClient.invalidateQueries({ queryKey: ["getLayouts"] });
        navigate("/layouts");
      },
      onError: (err) =>
        toast.error(err?.message || "Failed to create layout"),
    }
  );

  const { 
    control, 
    handleSubmit, 
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(layoutSchema),
    defaultValues: {
      layoutTitle: "",
      menuTitle: "",
      aboutTitle: "",
      aboutDescription: "",
      cafeDescription:
        "",
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("layoutTitle", data.layoutTitle);
    formData.append("homeImage", data.homeImage);
    formData.append("menuTitle", data.menuTitle);
    formData.append("aboutImage", data.aboutImage);
    formData.append("aboutTitle", data.aboutTitle);
    formData.append("aboutDescription", data.aboutDescription);
    formData.append("cafeDescription", data.cafeDescription);

    createLayout(formData);
  };

  return (
    <Box sx={{ maxWidth: 1100, margin: "30px auto", padding: 3 }}>
      <Paper sx={{ padding: 3, borderRadius: 3 }}>

        {/* ===== HEADER (BACK + SAVE) ===== */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" fontWeight={700}>
              Create Cafe Layout
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || !isValid}
          >
            {isPending ? "Saving..." : "Save Layout"}
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>

          {/* ===== LAYOUT TITLE (ROLE BASED) ===== */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={1}>
                  Layout Title
                </Typography>

                {isSuperAdmin ? (
                  <Controller
                    name="layoutTitle"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Enter Layout Title"
                      />
                    )}
                  />
                ) : (
                  <Typography variant="h6" color="primary">
                    Premium Cafe Layout
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* ===== HOME IMAGE ===== */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={1}>
                  <StorefrontIcon /> Home Image
                </Typography>

                <Controller
                  name="homeImage"
                  control={control}
                  render={({ field }) => (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                      fullWidth
                    >
                      Upload Home Image
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(e.target.files[0])
                        }
                      />
                    </Button>
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* ===== MENU SECTION ===== */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={1}>
                  <MenuIcon /> Menu Section
                </Typography>

                <Controller
                  name="menuTitle"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Menu Title"
                      fullWidth
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* ===== ABOUT SECTION ===== */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={1}>
                  <InfoIcon /> About Section
                </Typography>

                <Controller
                  name="aboutImage"
                  control={control}
                  render={({ field }) => (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                      fullWidth
                    >
                      Upload About Image
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(e.target.files[0])
                        }
                      />
                    </Button>
                  )}
                />

                <Box mt={2}>
                  <Controller
                    name="aboutTitle"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="About Title"
                        fullWidth
                      />
                    )}
                  />
                </Box>

                <Box mt={2}>
                  <Typography fontWeight={600} mb={1}>
                    About Description (Rich Text)
                  </Typography>

                  <Controller
                    name="aboutDescription"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        content={field.value}
                        extensions={[StarterKit]}
                        onUpdate={({ editor }) =>
                          field.onChange(editor.getHTML())
                        }
                        renderControls={() => (
                          <MenuControlsContainer>
                            <MenuSelectHeading />
                            <MenuDivider />
                            <MenuButtonBold />
                            <MenuButtonItalic />
                          </MenuControlsContainer>
                        )}
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ===== CAFE DESCRIPTION ===== */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography fontWeight={600} mb={1}>
                  Cafe Description (Rich Text)
                </Typography>

                <Controller
                  name="cafeDescription"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value}
                      extensions={[StarterKit]}
                      onUpdate={({ editor }) =>
                        field.onChange(editor.getHTML())
                      }
                      renderControls={() => (
                        <MenuControlsContainer>
                          <MenuSelectHeading />
                          <MenuDivider />
                          <MenuButtonBold />
                          <MenuButtonItalic />
                        </MenuControlsContainer>
                      )}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
}
