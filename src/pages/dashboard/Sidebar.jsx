import { Box, Typography } from "@mui/material";

export default function Sidebar({ icon, label, active, onClick, collapsed }) {
  return (
    <Box
      onClick={onClick}
      display="flex"
      alignItems="center"
      gap={collapsed ? 0 : 2}
      justifyContent={collapsed ? "center" : "flex-start"}
      px={collapsed ? 1 : 2}
      py={1.25}
      borderRadius={2}
      sx={{
        cursor: "pointer",
        bgcolor: active ? "rgba(255,255,255,0.15)" : "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
      }}
    >
      {icon}
      {!collapsed && (
        <Typography fontWeight={500}>{label}</Typography>
      )}
    </Box>
  );
}
