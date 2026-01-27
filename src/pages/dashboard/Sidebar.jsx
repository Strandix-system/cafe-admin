import { Box, Typography } from "@mui/material";

export default function Sidebar({ icon, label, active, onClick }) {
  return (
    <Box
      onClick={onClick}
      display="flex"
      alignItems="center"
      gap={2}
      px={2}
      py={1.5}
      borderRadius={2}
      sx={{
        cursor: "pointer",
        bgcolor: active ? "rgba(255,255,255,0.15)" : "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
      }}
    >
      {icon}
      <Typography fontWeight={500}>{label}</Typography>
    </Box>
  );
}
