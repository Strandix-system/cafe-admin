import { Chip } from "@mui/material";

export const CommonChip = ({
  label,
  size = "medium",
  color,
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
  return (
    <Chip
      label={label}
      size={size}
      color={color}
      icon={icon}
      onClick={onClick}
      sx={{
        height,
        fontSize,
        fontWeight,
        width,
        borderRadius: "10px",
        backgroundColor: bgColor,
        color: textColor,
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
