import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { Upload } from "lucide-react";

import toast from "react-hot-toast";
import { usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";

const CreateLayout = () => {

  const [form, setForm] = useState({
    name: "",
    description: "",
    // image: null,
    image: "",
  });

  const { mutate: createLayout, isLoading } = usePost(
  API_ROUTES.createLayout,
  {
    onSuccess: () => {
      toast.success("Layout added successfully ☕✨");
      setForm(initialForm); // ✅ clear form
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to add layout");
    },
  }
);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name || !form.description || !form.image) {
            toast.error("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("image", form.image);

        createLayout(formData); // 🚀 API call
    };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Create Layout
      </Typography>

      <Card sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Layout Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Image"
          name="image"
          multiline
          rows={3}
          value={form.image}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {/* <Button
          variant="outlined"
          component="label"
          startIcon={<Upload />}
          sx={{ mb: 2 }}
        >
          Upload Layout Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button> */}

        {/* {form.image && (
          <Typography variant="body2">
            Selected: {form.image.name}
          </Typography>
        )} */}

        <Box mt={3}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Layout"}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CreateLayout;
