import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Grid, Box, FormLabel } from "@mui/material";
import { useEffect } from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
    Title,
    Restaurant,
    Description,
    Instagram,
    Facebook,
    Twitter,
} from "@mui/icons-material";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { APIRequest } from "../../utils/api_request";
import { toast } from "react-hot-toast";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";
import ImageUploadSection from "../../components/common/ImageUploadSection";
import { useImageUpload } from "../../utils/hooks/useImageUpload";
// import { m } from "framer-motion";

const profileSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email required"),
    phoneNumber: yup.string().required("Phone number required"),
    profileImage: yup.mixed().nullable(),
    hours: yup.object({
        weekdays: yup.string().required("Weekdays hours required"),
        weekends: yup.string().required("Weekends hours required"),
    }),
    socialLinks: yup.object({
        instagram: yup.string().url("Invalid Instagram URL"),
        facebook: yup.string().url("Invalid Facebook URL"),
        twitter: yup.string().url("Invalid Twitter URL"),
    }),
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

export default function Profile({
    defaultValues = {},
    onSubmit,
    isLoading = false,
    isSubmitting = false,
    isAdmin = false,
}) {
    const isEdit = Object?.entries(defaultValues)?.length > 0;
    const { data, isLoading: profileLoading } = useFetch({
        queryKey: ["profile"],   // ⚠ must be array
        url: API_ROUTES.getMyProfile,

    });
    console.log("ROUTE:", API_ROUTES.getMyProfile);


    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isValid, errors },
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: null,
            profileImage: null,
            socialLinks: {
                instagram: "",
                facebook: "",
                twitter: "",
            },
        },
        mode: "all",
    });

    console.log("values", watch());

    // Use custom hook for image upload management
    const { previews, handleImageChange, handleReplaceImage, setPreview } =
        useImageUpload(setValue);





    const handleFormSubmit = async (data) => {
        try {
            const formData = new FormData();

            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phoneNumber);

            // Image only if new uploaded
            if (data.profileImage instanceof File) {
                formData.append("profileImage", data.profileImage);
            }

            const response = await APIRequest({
                method: "PUT",
                url: API_ROUTES.updateProfile,
                data: formData,
            });

            if (response.success) {
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        }
    };

    useEffect(() => {
        if (data?.success && data?.result) {
            const profile = data.result;

            reset({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber || "",
                profileImage: profile.profileImage || null,
                hours: {
                    weekdays: profile.hours?.weekdays || "",
                    weekends: profile.hours?.weekends || "",
                },
                socialLinks: {
                    instagram: profile.socialLinks?.instagram || "",
                    facebook: profile.socialLinks?.facebook || "",
                    twitter: profile.socialLinks?.twitter || "",
                },
            });

            // Set image preview
            if (profile.profileImage) {
                setPreview("profileImage", profile.profileImage);
            }
        }
    }, [data, reset, setPreview]);


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

    // Replace renderTextField function
    const renderTextField = (
        name,
        label,
        icon,
        placeholder,
        multiline = false,
        gridSize = { xs: 12 },
        disabled = false,
    ) => (
        <Grid size={gridSize}>
            <FormLabel
                sx={{
                    color: "#6F4E37",
                    fontWeight: 600,
                    mb: 1,
                    display: "block",
                }}
            >
                {label}
            </FormLabel>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <InputField
                        field={field}
                        error={
                            errors[name.split(".").reduce((obj, key) => obj?.[key], errors)]
                        }
                        helperText={
                            disabled && name === "layoutTitle"
                                ? "Title cannot be changed"
                                : errors[name.split(".").reduce((obj, key) => obj?.[key], errors)]
                                    ?.message
                        }
                        startIcon={icon}
                        placeholder={placeholder}
                        multiline={multiline}
                        rows={multiline ? 4 : undefined}
                    />
                )}
            />
        </Grid>
    );

    // Replace renderImageField function
    const renderImageField = (
        fieldName,
        label,
        inputId,
        gridSize = { xs: 12 },
    ) => (
        <Grid size={gridSize}>
            <FormLabel
                sx={{
                    color: "#6F4E37",
                    fontWeight: 600,
                    mb: 1,
                    display: "block",
                }}
            >
                {label}
            </FormLabel>
            <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                    <>
                        <ImageUploadSection
                            label=""
                            field={field}
                            preview={previews[fieldName]}
                            setPreview={(preview) => setPreview(fieldName, preview)}
                            handleImageChange={(file) => handleImageChange(file, fieldName)}
                            handleReplaceImage={() => handleReplaceImage(fieldName)}
                            inputId={inputId}
                            isEdit={isEdit}
                        />
                        {errors[fieldName] && (
                            <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                                {errors[fieldName]?.message}
                            </Box>
                        )}
                    </>
                )}
            />
        </Grid>
    );

    // Replace renderTimeField function
    const renderTimeField = (name, label, gridSize = { xs: 12 }) => (
        <Grid size={gridSize}>
            <FormLabel
                sx={{
                    color: "#6F4E37",
                    fontWeight: 600,
                    mb: 1,
                    display: "block",
                }}
            >
                {label}
            </FormLabel>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        <div className="flex gap-4 mt-2">{renderTimePickers(field)}</div>
                        {errors.hours?.[name.split(".")[1]] && (
                            <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                                {errors.hours[name.split(".")[1]].message}
                            </Box>
                        )}
                    </>
                )}
            />
        </Grid>
    );

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
                <h2 className="text-2xl font-bold">Profile </h2>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading || !isValid || isSubmitting}
                    sx={{
                        bgcolor: "#6F4E37",
                        "&:hover": { bgcolor: "#5A3D2B" },
                    }}
                >
                    {isEdit && !isAdmin ? "Update Layout" : "Create Layout"}
                </Button>
            </div>
            <Grid container spacing={3}>
                {/* ROW 1: Two Images Side by Side */}
                {renderImageField("profileImage", "Profile Image Upload", {
                    xs: 12,
                    md: 6,
                })}
                {renderImageField("aboutImage", "About Image Upload", {
                    xs: 12,
                    md: 6,
                })}

                {/* ROW 2: Layout Title & Menu Title */}
                {renderTextField(
                    "firstName",
                    "First Name",
                    "Enter first name",
                    false,
                    { xs: 12, md: 6 },
                )}
                {renderTextField(
                    "lastName",
                    "Last Name",

                    "Enter last name",
                    false,
                    { xs: 12, md: 6 },
                )}

                {/* ROW 3: About Title */}
                {renderTextField(
                    "email",
                    "email",
                    <Title sx={{ color: "#6F4E37" }} />,
                    "Enter about email",
                )}

                {/* ROW 4: Descriptions */}
                {renderTextField(
                    "phoneNumber",
                    "Phone Number",
                    <Description sx={{ color: "#6F4E37" }} />,
                    "Enter Phone Number ",
                    true,
                    { xs: 12, md: 6 },
                )}
                {/* {renderTextField(
                    "cafeDescription",
                    "Cafe Description",
                    <Description sx={{ color: "#6F4E37" }} />,
                    "Enter cafe description",
                    true,
                    { xs: 12, md: 6 },
                )} */}

                {/* Hours */}
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {renderTimeField("hours.weekdays", "Weekdays Hours", {
                        xs: 12,
                        md: 6,
                    })}
                    {renderTimeField("hours.weekends", "Weekends Hours", {
                        xs: 12,
                        md: 6,
                    })}
                </LocalizationProvider> */}

                {/* Social Links */}
                {renderTextField(
                    "socialLinks.instagram",
                    "Instagram Link",
                    <Instagram sx={{ color: "#6F4E37" }} />,
                    "https://instagram.com/yourcafe",
                    false,
                    { xs: 12, md: 4 },
                )}
                {renderTextField(
                    "socialLinks.facebook",
                    "Facebook Link",
                    <Facebook sx={{ color: "#6F4E37" }} />,
                    "https://facebook.com/yourcafe",
                    false,
                    { xs: 12, md: 4 },
                )}
                {renderTextField(
                    "socialLinks.twitter",
                    "Twitter Link",
                    <Twitter sx={{ color: "#6F4E37" }} />,
                    "https://twitter.com/yourcafe",
                    false,
                    { xs: 12, md: 4 },
                )}
            </Grid>
        </form>
    );
}
