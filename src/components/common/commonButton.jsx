import { Button, CircularProgress } from "@mui/material";

const DEFAULT_COLOR = "#6F4E37";
const DEFAULT_HOVER = "#5D4037";

export const CommonButton = ({
  children,

  /* core */
  type = "button",
  onClick,
  disabled = false,

  /* loading (OPTIONAL) */
  loading = false,

  /* variant & layout */
  variant = "contained",
  fullWidth = false,

  /* sizing */
  width,
  height,
  py = 1.5,

  /* colors */
  bgColor = DEFAULT_COLOR,
  hoverColor = DEFAULT_HOVER,
  textColor = "white",

  sx = {},
  ...rest
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      sx={{
        borderRadius: 3,
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: 600,
        py,
        width,
        height,

        ...(variant === "contained" && {
          backgroundColor: bgColor,
          color: textColor,
          "&:hover": { backgroundColor: hoverColor },
        }),

        ...(variant === "outlined" && {
          borderColor: bgColor,
          color: bgColor,
          "&:hover": {
            borderColor: hoverColor,
            backgroundColor: "rgba(111,78,55,0.08)",
          },
        }),

        ...(variant === "text" && {
          color: bgColor,
          "&:hover": {
            backgroundColor: "rgba(111,78,55,0.08)",
          },
        }),

        ...sx,
      }}
      {...rest}
    >
      {loading ? <CircularProgress size={26} color="inherit" /> : children}
    </Button>
  );
};


