import { Box, Card, CardMedia, IconButton, Radio } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function LayoutPreviewCard({
  layout,
  selectedId,
  onSelect,
  onPreview,
}) {
  const isSelected = selectedId === layout._id;

  return (
    <Card
      sx={{
        position: "relative",
        width: 260,
        height: 180,
        borderRadius: 3,
        overflow: "hidden",
        border: isSelected ? "3px solid #6F4E37" : "1px solid #ddd",
        transition: "0.3s",
        "&:hover .hoverBtn": { opacity: 1 },
      }}
    >
      {/* RADIO BUTTON (TOP LEFT) */}
      <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
        <Radio
          checked={isSelected}
          onChange={() => onSelect(layout._id)}
          sx={{ color: "#6F4E37" }}
        />
      </Box>

      {/* HOME IMAGE */}
      <CardMedia
        component="img"
        height="180"
        image={layout.homeImage}
        alt={layout.layoutTitle}
      />

      {/* HOVER PREVIEW BUTTON */}
      <IconButton
        className="hoverBtn"
        onClick={() => onPreview(layout)}
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          bgcolor: "white",
          opacity: 0,
          transition: "0.3s",
          boxShadow: 2,
        }}
      >
        <VisibilityIcon />
      </IconButton>
    </Card>
  );
}
