import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { DialogTitle } from "@mui/material";
import {
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Tooltip,
    Dialog,
    DialogContent,
} from "@mui/material";
import {
    ImagePlus,
    X,
    FileText,
    Send,
    Headphones,
} from "lucide-react";
import toast from "react-hot-toast";
import { usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
// import { queryClient } from "@tanstack/react-query";
import { InputField } from "../../components/common/InputField";
import { queryClient } from "../../lib/queryClient";

export default function SupportForm({ open, onClose }) {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [descLen, setDescLen] = useState(0);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: { title: "", description: "" },
    });

    const { mutate: createTicket, isPending } = usePost(
        API_ROUTES.createSupportTicket,
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
                toast.success("Ticket submitted successfully");
                reset();
                setImages([]);
                setPreviews([]);
                setDescLen(0);
                if (open) onClose?.();
            },
            onError: (err) => {
                toast.error(err?.message || "Something went wrong");
            },
        }
    );

    const addFiles = useCallback((files) => {
        const valid = files.filter((f) => f.type.startsWith("image/"));
        setImages((prev) => [...prev, ...valid]);

        valid.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) =>
                setPreviews((prev) => [
                    ...prev,
                    { src: e.target.result, name: file.name },
                ]);
            reader.readAsDataURL(file);
        });
    }, []);

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
        setPreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    const onSubmit = (data) => {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);

        images.forEach((img) => {
            formData.append("images", img);
        });

        createTicket(formData);
    };

    const formContent = (
        <Box
            className="w-full max-w-lg mx-auto flex flex-col py-8"
        >
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
                <Box
                >

                </Box>
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >
                {/* Title */}
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Please enter a title" }}
                    render={({ field }) => (
                        <InputField
                            {...field}
                            label="Issue Title"
                            error={errors.title}
                            helperText={errors.title?.message}
                            startIcon={<FileText size={16} />}
                        />
                    )}
                />

                {/* Description */}
                <Controller
                    name="description"
                    control={control}
                    rules={{
                        required: "Please describe your issue",
                        maxLength: { value: 1000, message: "Max 1000 characters" },
                    }}
                    render={({ field }) => (
                        <Box>
                            <InputField
                                {...field}
                                label="Description"
                                multiline
                                rows={5}
                                error={errors.description}
                                helperText={errors.description?.message}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setDescLen(e.target.value.length);
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    textAlign: "right",
                                    mt: 1,
                                    color: descLen > 900 ? "#ef4444" : "#9ca3af",
                                }}
                            >
                                {descLen} / 1000
                            </Typography>
                        </Box>
                    )}
                />

                {/* Image Upload */}
                <Box>
                    <Box
                        className="relative flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-2xl cursor-pointer text-center"
                        sx={{
                            border: `2px dashed ${isDragOver
                                ? "rgba(79,110,247,0.5)"
                                : "rgba(79,110,247,0.2)"
                                }`,
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
                            onChange={(e) =>
                                addFiles(Array.from(e.target.files))
                            }
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
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(88px, 1fr))",
                            }}
                        >
                            {previews.map((p, i) => (
                                <Box
                                    key={i}
                                    className="relative rounded-xl overflow-hidden"
                                    sx={{
                                        aspectRatio: "1",
                                        border:
                                            "1px solid rgba(79,110,247,0.12)",
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
                                                bgcolor: "rgba(239,68,68,0.1)",
                                                color: "#ef4444",
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
                    disabled={isPending}
                    startIcon={
                        isPending ? (
                            <CircularProgress size={15} sx={{ color: "#fff" }} />
                        ) : (
                            <Send size={15} />
                        )
                    }
                    sx={{
                        py: 1.8,
                        background:
                            "linear-gradient(135deg, #6f4e37 0%, #8b6a55 100%)",
                        color: "#fff",
                        borderRadius: "10px",
                        textTransform: "none",
                    }}
                >
                    {isPending ? "Submitting…" : "Submit Ticket"}
                </Button>
            </Box>
        </Box>
        // </Box>
    );

    if (typeof open === "boolean") {
        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, } }}
            >
                {/* <DialogContent sx={{ p: 0, position: "relative" }}> */}
                <IconButton IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        bgcolor: "rgba(255,255,255,0.85)",
                    }
                    }
                >
                    <X size={16} />
                </IconButton >
                {formContent}
                {/* </DialogContent> */}
            </Dialog >
        );
    }
    return formContent;
}
