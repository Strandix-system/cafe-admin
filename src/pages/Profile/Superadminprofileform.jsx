import { yupResolver } from "@hookform/resolvers/yup";
import { Email, Instagram, Facebook, Twitter } from "@mui/icons-material";
import {
    Box,
    Paper,
    Typography,
    Grid,
} from "@mui/material";
import { Contact, UserRoundPlus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import CommonImageField from "../../components/common/CommonImageField";
import CommonButton from "../../components/common/commonButton";
import { useImageUpload } from "../../utils/hooks/useImageUpload";
import CommonTextField from "../../components/common/CommonTextField";
const superAdminProfileSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
    profileImage: yup.mixed().nullable(),
    socialLinks: yup.object({
        instagram: yup.string().url("Enter a valid URL").nullable().optional(),
        facebook: yup.string().url("Enter a valid URL").nullable().optional(),
        twitter: yup.string().url("Enter a valid URL").nullable().optional(),
    }),
});

export default function SuperAdminProfileForm({
    defaultValues = {},
    onSubmit,
    isSubmitting = false,
}) {
    const isEdit = Object.entries(defaultValues).length > 0;

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            profileImage: null,
            socialLinks: {
                instagram: "",
                facebook: "",
                twitter: "",
            },
        },
        resolver: yupResolver(superAdminProfileSchema),
        context: { isEdit },
        mode: "all",
    });

    const { previews, setPreview } = useImageUpload(setValue);

    useEffect(() => {
        if (isEdit) {
            reset({
                firstName: defaultValues.firstName || "",
                lastName: defaultValues.lastName || "",
                email: defaultValues.email || "",
                phoneNumber: String(defaultValues.phoneNumber || ""),
                profileImage: defaultValues.profileImage || null,
                socialLinks: {
                    instagram: defaultValues.socialLinks?.instagram || "",
                    facebook: defaultValues.socialLinks?.facebook || "",
                    twitter: defaultValues.socialLinks?.twitter || "",
                },
            });

            if (defaultValues.profileImage) {
                setPreview("profileImage", defaultValues.profileImage);
                setValue("profileImage", defaultValues.profileImage, {
                    shouldValidate: true,
                });
            }
        }
    }, [defaultValues, reset, isEdit, setPreview, setValue]);

    const handleFormSubmit = (data) => {
        onSubmit({
            ...data,
            phoneNumber: Number(data.phoneNumber),
        });
    };

    return (
        <Box sx={{ width: "100%", height: "100%", bgcolor: "#FAF7F2" }}>
            <Paper elevation={3} sx={{ mx: "auto", overflow: "hidden" }}>
                {/* Header */}
                <Box
                    sx={{
                        px: 4,
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <UserRoundPlus className="w-7 h-7" />
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Super Admin Profile
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Update your personal information
                            </Typography>
                        </Box>
                    </Box>

                    <CommonButton
                        type="submit"
                        form="superadmin-profile-form"
                        disabled={!isValid || isSubmitting}
                        bgColor="white"
                        hoverColor="#F5EFE6"
                        textColor="#6F4E37"
                        sx={{
                            px: 4,
                            "&:disabled": {
                                bgcolor: "#E0E0E0",
                                color: "#9E9E9E",
                            },
                        }}
                    >
                        {isSubmitting ? "Saving..." : "Update"}
                    </CommonButton>
                </Box>

                {/* Form Body */}
                <Box
                    component="form"
                    id="superadmin-profile-form"
                    onSubmit={handleSubmit(handleFormSubmit)}
                    sx={{ px: 4, py: 4, bgcolor: "white" }}
                >
                    <Grid container spacing={4}>
                        {/* Profile Image */}
                        <CommonImageField
                            name="profileImage"
                            label="Profile Image"
                            inputId="superadmin-profile-upload"
                            control={control}
                            errors={errors}
                            preview={previews.profileImage}
                            setPreview={(val) => setPreview("profileImage", val)}
                            isEdit={isEdit}
                            gridSize={{ xs: 12, sm: 6 }}
                        />

                        {/* Empty grid to balance layout */}
                        <Grid size={{ xs: 12, sm: 6 }} />

                        {/* Basic Info Section */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ borderBottom: "2px solid #6F4E37", pb: 1, mb: 2 }}>
                                <Typography variant="h6" fontWeight={700} color="#6F4E37">
                                    Basic Information
                                </Typography>
                            </Box>
                        </Grid>

                        <CommonTextField
                            name="firstName"
                            label="First Name *"
                            placeholder="Enter First Name"
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="lastName"
                            label="Last Name *"
                            placeholder="Enter Last Name"
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="email"
                            label="Email *"
                            icon={<Email sx={{ color: "#6F4E37", fontSize: 20 }} />}
                            placeholder="Enter Email"
                            disabled={true}
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="phoneNumber"
                            label="Phone Number *"
                            icon={<Contact size={20} color="#6F4E37" />}
                            placeholder="Enter Phone Number"
                            control={control}
                            errors={errors}
                        />

                        {/* Social Links Section */}

                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}