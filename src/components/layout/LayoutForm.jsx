import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Grid, Box, FormLabel } from "@mui/material";
import { useEffect } from "react";
import {Loader} from "../common/Loader";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
    Title,
    Restaurant,
    Description,
    Instagram,
    Facebook,
    Twitter,
} from "@mui/icons-material";
import {InputField} from "../common/InputField";
import {ImageUploadSection} from "../common/ImageUploadSection";
import { useImageUpload } from "../../utils/hooks/useImageUpload";
import { m } from "framer-motion";
import {CommonTextField} from "../common/CommonTextField";
import {CommonImageField} from "../common/CommonImageField";
import {CommonButton} from "../common/commonButton";

const layoutSchema = yup.object({
    layoutTitle: yup.string().required("Layout title is required"),
    homeImage: yup
        .mixed()
        .test("required", "Home image is required", (value) => {
            return value instanceof File || (typeof value === 'string' && value.trim() !== '');
        })
        .test("fileOrUrl", "Invalid image", (value) => {
            if (!value) return false;
            if (value instanceof File) return true;
            if (typeof value === 'string') return value.trim() !== '';
            return false;
        }),
    menuTitle: yup
        .string()
        .trim()
        .min(3, "Menu title must be at least 3 characters")
        .required("Menu title is required"),
    aboutImage: yup
        .mixed()
        .test("required", "About image is required", (value) => {
            return value instanceof File || (typeof value === 'string' && value.trim() !== '');
        })
        .test("fileOrUrl", "Invalid image", (value) => {
            if (!value) return false;
            if (value instanceof File) return true;
            if (typeof value === 'string') return value.trim() !== '';
            return false;
        }),
    aboutTitle: yup
        .string()
        .trim()
        .min(3, "About title is required")
        .required("About title is required"),
    aboutDescription: yup.string().required("About description is required"),
    cafeDescription: yup.string().required("Cafe description is required"),
});

const TIME_PICKER_STYLES = {
    textField: {
        size: "small",
        sx: {
            "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F5EFE6",
            },
        },
    },
};

export function LayoutForm({
    defaultValues = {},
    onSubmit,
    isLoading = false,
    isSubmitting = false,
    isAdmin = false,
}) {
    // const isEdit = Object?.entries(defaultValues)?.length > 0;
    const isEdit = Boolean(defaultValues?._id);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isValid, errors },
    } = useForm({
        resolver: yupResolver(layoutSchema),
        defaultValues: {
            layoutTitle: "",
            homeImage: null,
            menuTitle: "",
            aboutImage: null,
            aboutTitle: "",
            aboutDescription: "",
            cafeDescription: "",
        },
        mode: "all",
    });

    // Use custom hook for image upload management
    const { previews, handleImageChange, handleReplaceImage, setPreview } =
        useImageUpload(setValue);

    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    useEffect(() => {
        if (isEdit) {
            reset(defaultValues);
            if (defaultValues.homeImage) {
                setPreview("homeImage", defaultValues.homeImage);
                setValue("homeImage", defaultValues.homeImage, { shouldValidate: true }); // ← Add this
            }
            if (defaultValues.aboutImage) {
                setPreview("aboutImage", defaultValues.aboutImage);
                setValue("aboutImage", defaultValues.aboutImage, { shouldValidate: true }); // ← Add this
            }
        }
    }, [defaultValues, reset, isEdit, setPreview, setValue]);

    const renderTimePickers = (field) => {
        const parts = field.value ? field.value.split(" - ") : [null, null];
        const openTime = parts[0]?.trim() || null;
        const closeTime = parts[1]?.trim() || null;

        const handleOpenChange = (newVal) => {
            if (newVal) {
                const formatted = `${dayjs(newVal).format("h:mm A")}${closeTime ? ` - ${closeTime}` : ""}`;
                field.onChange(formatted);
            }
        };

        const handleCloseChange = (newVal) => {
            if (newVal) {
                const formatted = `${openTime || ""} - ${dayjs(newVal).format("h:mm A")}`;
                field.onChange(formatted);
            }
        };

        return (
            <>
                <TimePicker
                    label="Open"
                    ampm={true}
                    format="h:mm A"
                    value={openTime ? dayjs(openTime, "h:mm A") : null}
                    onChange={handleOpenChange}
                    slotProps={TIME_PICKER_STYLES}
                />

                <TimePicker
                    label="Close"
                    ampm={true}
                    format="h:mm A"
                    value={closeTime ? dayjs(closeTime, "h:mm A") : null}
                    onChange={handleCloseChange}
                    slotProps={TIME_PICKER_STYLES}
                />
            </>
        );
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <Loader variant="spinner" />
            </Box>
        );
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-10 py-6">
            {/* ===== HEADER ===== */}
            <div className="flex gap-3 items-center justify-between w-full mb-6">
                <h2 className="text-2xl font-bold">Customize Layout</h2>

                <CommonButton
                    type="submit"
                    variant="contained"
                    disabled={isLoading || !isValid || isSubmitting}
                >
                    {isEdit ? "Update Layout" : "Create Layout"}
                </CommonButton>
            </div>

            <Grid container spacing={3}>
                {/* ROW 1: Two Images Side by Side */}

                <CommonImageField
                    name="homeImage"
                    label="Home Image"
                    inputId="home-image--upload"
                    control={control}
                    errors={errors}
                    preview={previews.homeImage}
                    setPreview={setPreview}
                    isEdit={isEdit}
                    gridSize={{ xs: 12, md: 6 }}
                />

                <CommonImageField
                    name="aboutImage"
                    label="About Image"
                    inputId="about-image-upload"
                    control={control}
                    errors={errors}
                    preview={previews.aboutImage}
                    setPreview={setPreview}
                    isEdit={isEdit}
                    gridSize={{ xs: 12, md: 6 }}
                />

                <CommonTextField
                    name="layoutTitle"
                    label="Layout Title"
                    icon={<Title sx={{ color: "#6F4E37" }} />}
                    placeholder="Enter layout title"
                    gridSize={{ xs: 12, md: 6 }}
                    control={control}
                    errors={errors}
                />

                <CommonTextField
                    name="menuTitle"
                    label="Menu Title"
                    icon={<Restaurant sx={{ color: "#6F4E37" }} />}
                    placeholder="Enter menu title"
                    gridSize={{ xs: 12, md: 6 }}
                    control={control}
                    errors={errors}
                />

                {/* ROW 3: About Title */}

                <CommonTextField
                    name="aboutTitle"
                    label="About Title"
                    icon={<Title sx={{ color: "#6F4E37" }} />}
                    placeholder="Enter about title"
                    control={control}
                    errors={errors}
                />

                {/* ROW 4: Descriptions */}
                <CommonTextField
                    name="aboutDescription"
                    label="About Description"
                    icon={<Description sx={{ color: "#6F4E37" }} />}
                    placeholder="Enter about description"
                    multiline={true}
                    gridSize={{ xs: 12 }}
                    control={control}
                    errors={errors}
                />

                <CommonTextField
                    name="cafeDescription"
                    label="Cafe Description"
                    icon={<Description sx={{ color: "#6F4E37" }} />}
                    placeholder="Enter cafe description"
                    multiline={true}
                    gridSize={{ xs: 12 }}
                    control={control}
                    errors={errors}
                />

            </Grid>
        </form>
    );
}