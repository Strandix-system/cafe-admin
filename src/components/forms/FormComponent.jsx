import { yupResolver } from "@hookform/resolvers/yup";
import {
    Email,
    Visibility,
    VisibilityOff,
    Instagram,
    Facebook,
    Twitter,
} from "@mui/icons-material";
import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    OutlinedInput,
    TextField,
    Box,
    Paper,
    Typography,
} from "@mui/material";
import {
    Building2,
    Contact,
    Lock,
    MapPin,
    UserRoundPlus,
    Users,
    Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import {Loader} from "../common/Loader";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { adminSchema } from "../../utils/adminSchema/adminSchema";
import {ImageUploadSection} from "../common/ImageUploadSection";
import {InputField} from "../common/InputField";
import { useImageUpload } from "../../utils/hooks/useImageUpload";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { parseHoursFromBackend } from "../../utils/utils";
import {CommonTextField} from "../common/CommonTextField";
import {CommonImageField} from "../common/CommonImageField";
import {CommonTimeField} from "../common/CommonTimeField";
import {CommonButton} from "../common/commonButton";

// Enable custom parse format plugin
dayjs.extend(customParseFormat);

const TIME_PICKER_STYLES = {
    textField: {
        size: "small",
        fullWidth: true,
        sx: {
            "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F5EFE6",
                "&:hover": { bgcolor: "#EFE5D8" },
            },
        },
    },
};

export function FormComponent({
    defaultValues = {},
    onSubmit,
    isSubmitting = false,
}) {
    const isEdit = Object?.entries(defaultValues)?.length > 0;
    const {
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            cafeName: "",
            phoneNumber: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            gst: "",
            logo: null,
            profileImage: null,
            hours: {
                weekdays: {
                    open: null,
                    close: null,
                },
                weekends: {
                    open: null,
                    close: null,
                },
            },
            socialLinks: {
                instagram: "",
                facebook: "",
                twitter: "",
            },
        },
        resolver: yupResolver(adminSchema),
        context: { isEdit },
        mode: "all",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data: { data: statesData } = {} } = useFetch(
        "states",
        API_ROUTES.getstates,
    );

    const { previews, handleImageChange, handleReplaceImage, setPreview } =
        useImageUpload(setValue);

    const handleFormSubmit = (data) => {
        const { confirmPassword, ...rest } = data;
        onSubmit({
            ...rest,
            phoneNumber: Number(data.phoneNumber),
            gst: Number(data.gst),
        });
    };

    const handleRemoveImage = (fieldName) => {
        setValue(fieldName, null);
        setPreview(fieldName, null);
    };

    useEffect(() => {
        if (isEdit) {
            const transformedDefaults = {
                ...defaultValues,
                hours: {
                    weekdays: parseHoursFromBackend(defaultValues.hours?.weekdays),
                    weekends: parseHoursFromBackend(defaultValues.hours?.weekends),
                },
            };

            reset(transformedDefaults);
            // Set image previews from deployed URLs
            if (defaultValues.logo) {
                setPreview("logo", defaultValues.logo);
                setValue("logo", defaultValues.logo, { shouldValidate: true });
            }
            if (defaultValues.profileImage) {
                setPreview("profileImage", defaultValues.profileImage);
                setValue("profileImage", defaultValues.profileImage, {
                    shouldValidate: true,
                });
            }
        }
    }, [defaultValues, reset, isEdit, setPreview, setValue]);

    return (
        <Box sx={{ width: "100%", height: "100%", bgcolor: "#FAF7F2" }}>
            <Paper
                elevation={3}
                sx={{
                    mx: "auto",
                    overflow: "hidden",
                }}
            >
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
                                {isEdit ? "Edit Cafe" : "Create Cafe"}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {!isEdit
                                    ? "Enter cafe details to create a new account"
                                    : "Update cafe details"}
                            </Typography>
                        </Box>
                    </Box>

                    <CommonButton
                        type="submit"
                        form="admin-form"
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
                        {isEdit ? "Update" : "Create"}
                        {isSubmitting && <Loader variant="buttonLoader" />}
                    </CommonButton>
                </Box>

                <Box
                    component="form"
                    id="admin-form"
                    onSubmit={handleSubmit(handleFormSubmit)}
                    sx={{ px: 4, py: 4, bgcolor: "white" }}
                >
                    <Grid container spacing={4}>
                        {/* File Uploads */}

                        <CommonImageField
                            name="logo"
                            label="Cafe Logo"
                            inputId="logo-upload"
                            control={control}
                            errors={errors}
                            preview={previews.logo}
                            setPreview={setPreview}
                            isEdit={isEdit}
                            gridSize={{ xs: 12, sm: 6 }}
                        />

                        <CommonImageField
                            name="profileImage"
                            label="Profile Image"
                            inputId="profile-upload"
                            control={control}
                            errors={errors}
                            preview={previews.profileImage}
                            setPreview={setPreview}
                            isEdit={isEdit}
                            gridSize={{ xs: 12, sm: 6 }}
                        />


                        {/* Basic Information */}
                        <CommonTextField
                            name="firstName"
                            label="First Name *"
                            icon={<Users size={20} color="#6F4E37" />}
                            placeholder="Enter First Name"
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="lastName"
                            label="Last Name *"
                            icon={<Users size={20} color="#6F4E37" />}
                            placeholder="Enter Last Name"
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="email"
                            label="Email *"
                            icon={<Email sx={{ color: "#6F4E37", fontSize: 20 }} />}
                            placeholder="Enter Email"
                            disabled={isEdit}
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="cafeName"
                            label="Cafe Name *"
                            icon={<Building2 size={20} color="#6F4E37" />}
                            placeholder="Enter Cafe Name"
                            control={control}
                            errors={errors}
                            disabled={isEdit && !!defaultValues.cafeName}
                        />

                        {/* Password Field - Only in Create Mode */}
                        {!isEdit && (
                            <>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormLabel
                                        sx={{
                                            color: "#6F4E37",
                                            fontWeight: 600,
                                            mb: 1,
                                            display: "block",
                                        }}
                                    >
                                        Password *
                                    </FormLabel>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl
                                                fullWidth
                                                error={!!errors.password}
                                                size="small"
                                            >
                                                <OutlinedInput
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter Password"
                                                    sx={{
                                                        borderRadius: 2,
                                                        bgcolor: "#F5EFE6",
                                                        "&:hover": { bgcolor: "#EFE5D8" },
                                                    }}
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <Lock size={20} color="#6F4E37" />
                                                        </InputAdornment>
                                                    }
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? (
                                                                    <VisibilityOff />
                                                                ) : (
                                                                    <Visibility />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                                <FormHelperText>
                                                    {errors.password?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormLabel
                                        sx={{ color: "#6F4E37", fontWeight: 600, mb: 1, display: "block" }}
                                    >
                                        Confirm Password *
                                    </FormLabel>
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl
                                                fullWidth
                                                error={!!errors.confirmPassword}
                                                size="small"
                                            >
                                                <OutlinedInput
                                                    {...field}
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Re-enter Password"
                                                    sx={{
                                                        borderRadius: 2,
                                                        bgcolor: "#F5EFE6",
                                                        "&:hover": { bgcolor: "#EFE5D8" },
                                                    }}
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <Lock size={20} color="#6F4E37" />
                                                        </InputAdornment>
                                                    }
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                                <FormHelperText>
                                                    {errors.confirmPassword?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                            </>
                        )}

                        {/* Contact Information Section */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    borderBottom: "2px solid #6F4E37",
                                    pb: 1,
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} color="#6F4E37">
                                    Contact Information
                                </Typography>
                            </Box>
                        </Grid>

                        <CommonTextField
                            name="phoneNumber"
                            label="Phone Number *"
                            icon={<Contact size={20} color="#6F4E37" />}
                            placeholder="Enter Phone Number"
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="address"
                            label="Address *"
                            icon={<MapPin size={20} color="#6F4E37" />}
                            placeholder="Enter Address"
                            control={control}
                            errors={errors}
                        />


                        <CommonTextField
                            name="city"
                            label="City *"
                            placeholder="Enter City"
                            control={control}
                            errors={errors}
                        />

                        {/* State Dropdown */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormLabel
                                sx={{
                                    color: "#6F4E37",
                                    fontWeight: 600,
                                    mb: 1,
                                    display: "block",
                                }}
                            >
                                State *
                            </FormLabel>
                            <Controller
                                name="state"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
                                        select
                                        fullWidth
                                        size="small"
                                        error={!!errors.state}
                                        helperText={errors.state?.message}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                bgcolor: "#F5EFE6",
                                                "&:hover": { bgcolor: "#EFE5D8" },
                                            },
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {statesData?.map((state) => (
                                            <MenuItem key={state} value={state}>
                                                {state}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <CommonTextField
                            name="pincode"
                            label="Pincode *"
                            placeholder="Enter Pincode"
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="gst"
                            label="GST Percentage *"
                            placeholder="Enter GST Percentage"
                            disabled={false}
                            gridSize={{ xs: 12, sm: 6 }}
                            type="number"
                            control={control}
                            errors={errors}
                        />

                        {/* Operating Hours Section */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    borderBottom: "2px solid #6F4E37",
                                    pb: 1,
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} color="#6F4E37">
                                    Operating Hours
                                </Typography>
                            </Box>
                        </Grid>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {/* {renderTimeField(
                                "hours.weekdays.open",
                                "hours.weekdays.close",
                                "Weekdays Hours",
                            )} */}
                            <CommonTimeField
                                label="Weekdays Hours"
                                openName="hours.weekdays.open"
                                closeName="hours.weekdays.close"
                                control={control}
                                errors={errors}
                                TIME_PICKER_STYLES={TIME_PICKER_STYLES}
                            />
                            {/* {renderTimeField(
                                "hours.weekends.open",
                                "hours.weekends.close",
                                "Weekends Hours",
                            )} */}
                            <CommonTimeField
                                label="Weekends Hours"
                                openName="hours.weekends.open"
                                closeName="hours.weekends.close"
                                control={control}
                                errors={errors}
                                TIME_PICKER_STYLES={TIME_PICKER_STYLES}
                            />
                        </LocalizationProvider>

                        {/* Social Media Links Section */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    borderBottom: "2px solid #6F4E37",
                                    pb: 1,
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} color="#6F4E37">
                                    Social Media Links
                                </Typography>
                            </Box>
                        </Grid>


                        <CommonTextField
                            name="socialLinks.instagram"
                            label="Instagram Link"
                            icon={<Instagram sx={{ color: "#6F4E37" }} />}
                            placeholder="https://instagram.com/yourcafe"
                            disabled={false}
                            gridSize={{ xs: 12, md: 4 }}
                            type="url"
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="socialLinks.facebook"
                            label="Facebook Link"
                            icon={<Facebook sx={{ color: "#6F4E37" }} />}
                            placeholder="https://facebook.com/yourcafe"
                            disabled={false}
                            gridSize={{ xs: 12, md: 4 }}
                            type="url"
                            control={control}
                            errors={errors}
                        />

                        <CommonTextField
                            name="socialLinks.twitter"
                            label="Twitter Link"
                            icon={<Twitter sx={{ color: "#6F4E37" }} />}
                            placeholder="https://twitter.com/yourcafe"
                            disabled={false}
                            gridSize={{ xs: 12, md: 4 }}
                            type="url"
                            control={control}
                            errors={errors}
                        />
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}