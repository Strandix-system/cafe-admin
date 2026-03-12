import { Chip } from "@mui/material";

const VARIANT_STYLES = {
  success: { bgColor: "#D1FFBE", textColor: "#3DB309" }, // green  — paid, completed, active
  warning: { bgColor: "#FFF3CD", textColor: "#856404" }, // yellow — pending, on-hold
  error: { bgColor: "#FFDADA", textColor: "#FF0000" }, // red    — unpaid, cancelled, failed
  info: { bgColor: "#D1E7FF", textColor: "#004085" }, // blue   — accepted, preparing, new
  neutral: { bgColor: "#E0E0E0", textColor: "#616161" }, // grey   — default, inactive
  dark: { bgColor: "#1B5E20", textColor: "#FFFFFF" }, // dark green — frequent, verified
  vip: { bgColor: "#F59E0B", textColor: "#000000" }, // amber  — VIP, premium
  purple: { bgColor: "#EDE7F6", textColor: "#6A1B9A" }, // purple — special tags
  orange: { bgColor: "#f97316", textColor: "#ffffff" },
};

export const CommonChip = ({
  label,
  size = "medium",
  variant = "neutral",
  bgColor,
  textColor,
  icon,
  onClick,
  sx = {},
  fontWeight = 500,
  height = 20,
  fontSize = "10px",
  width,
}) => {
  const preset = VARIANT_STYLES[variant] ?? VARIANT_STYLES.neutral;

  return (
    <Chip
      label={label}
      size={size}
      icon={icon}
      onClick={onClick}
      sx={{
        height,
        fontSize,
        fontWeight,
        width,
        borderRadius: "10px",
        backgroundColor: bgColor ?? preset.bgColor,
        color: textColor ?? preset.textColor,
        "& .MuiChip-label": {
          px: 0.8,
          display: "flex",
          justifyContent: "flex-start",
        },
        ...sx,
      }}
    />
  );
};
