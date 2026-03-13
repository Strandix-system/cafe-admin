import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
  Dialog,
} from "@mui/material";
import { ImagePlus, X, Send } from "lucide-react";
import toast from "react-hot-toast";
import { usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { queryClient } from "../../lib/queryClient";
import { CommonTextField } from "../../components/common/CommonTextField";

const schema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});

export function SupportForm({ open, onClose }) {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [descLen, setDescLen] = useState(0);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", description: "" },
    mode: "onChange",
  });

  const title = watch("title");
  const description = watch("description");

  const isFormFilled = title?.trim() && description?.trim();
  const { mutate: createTicket, isPending } = usePost(
    API_ROUTES.createSupportTicket,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("get-support-tickets");
        toast.success("Ticket submitted successfully");
        reset();
        setImages([]);
        setPreviews([]);
        setDescLen(0);
        if (open) onClose?.();
      },
      onError: (err) => {
        toast.error(err);
      },
    },
  );
  const isAtLimit = images.length >= 3;

  const addFiles = useCallback(
    (files) => {
      if (isAtLimit) return;

      const valid = files
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, 3 - images.length);

      if (!valid.length) return;

      const readFile = (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) =>
            resolve({ src: e.target.result, name: file.name });
          reader.readAsDataURL(file);
        });

      Promise.all(valid.map(readFile)).then((newPreviews) => {
        setImages((prev) => [...prev, ...valid]);
        setPreviews((prev) => [...prev, ...newPreviews]);
      });
    },
    [images, isAtLimit],
  );

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (data) => {
    console.log("form data", data);
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);

    images.forEach((img) => {
      formData.append("images", img);
    });

    createTicket(formData);
  };

  const formContent = (
    <Box className="w-full max-w-lg mx-auto flex flex-col py-8">
      <Box className="flex items-start justify-between">
        <Box>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-1 bg-gradient-to-b from-[#6f4e37] to-[#8b6a55] rounded-full"></div>
            <Typography variant="h5" fontWeight={700}>
              Support Center
            </Typography>
          </div>
          <Typography sx={{ color: "#64748b", fontSize: 14, mb: 2 }}>
            Submit your issue and our team will assist you shortly.
          </Typography>
        </Box>
        <Box></Box>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <CommonTextField
          name="title"
          label="Title"
          placeholder="Describe your issue"
          // multiline={true}
          rows={5}
          control={control}
          errors={errors}
          onChange={(e) => setDescLen(e.target.value.length)}
        />
        <CommonTextField
          name="description"
          label="Description"
          placeholder="Describe your issue"
          multiline={true}
          rows={5}
          control={control}
          errors={errors}
          onChange={(e) => setDescLen(e.target.value.length)}
        />

        {/* Image Upload */}
        <Box>
          <Box
            className="relative flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-2xl cursor-pointer text-center"
            sx={{
              border: `2px dashed ${
                isDragOver ? "rgba(79,110,247,0.5)" : "rgba(79,110,247,0.2)"
              }`,
              opacity: isAtLimit ? 0.5 : 1,
              filter: isAtLimit ? "blur(1px)" : "none",
              pointerEvents: isAtLimit ? "none" : "auto",
              transition: "all 0.3s ease",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              addFiles(Array.from(e.dataTransfer.files));
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isAtLimit}
              onChange={(e) => addFiles(Array.from(e.target.files))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <ImagePlus size={22} />
            <Typography variant="body2">
              Drop images here or browse files
            </Typography>
          </Box>

          {previews.length > 0 && (
            <Box
              className="grid gap-2 mt-4"
              sx={{
                gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
              }}
            >
              {previews.map((p, i) => (
                <Box
                  key={i}
                  className="relative rounded-xl overflow-hidden"
                  sx={{
                    aspectRatio: "1",
                    border: "1px solid rgba(79,110,247,0.12)",
                  }}
                >
                  <img
                    src={p.src}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => removeImage(i)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        opacity: 0,
                        color: "#fff",
                        bgcolor: "rgba(0,0,0,0.5)",
                        "&:hover": {
                          opacity: 1,
                          bgcolor: "rgba(0,0,0,0.7)",
                        },
                      }}
                    >
                      <X size={12} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          disabled={!isFormFilled || isPending}
          startIcon={
            isPending ? (
              <CircularProgress size={15} sx={{ color: "#fff" }} />
            ) : (
              <Send size={15} />
            )
          }
          sx={{
            py: 1.8,
            background: "linear-gradient(135deg, #6f4e37 0%, #8b6a55 100%)",
            color: "#fff",
            borderRadius: "10px",
            textTransform: "none",
          }}
        >
          {isPending ? "Submitting…" : "Submit Ticket"}
        </Button>
      </Box>
    </Box>
  );

  if (typeof open === "boolean") {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            bgcolor: "rgba(255,255,255,0.85)",
          }}
        >
          <X size={16} />
        </IconButton>
        {formContent}
      </Dialog>
    );
  }
  return formContent;
}
