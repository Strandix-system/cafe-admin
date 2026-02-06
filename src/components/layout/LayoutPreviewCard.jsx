import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Radio,
  Typography,
} from "@mui/material";
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
        "&:hover .overlay": {
          opacity: 1,
        },
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
        className="h-full"
        image={layout.homeImage}
        alt={layout.layoutTitle}
      />

      <Box
        className="overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.3s",
          backgroundColor: "rgba(0,0,0,0.4)", // optional dark overlay
          zIndex: 100,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: 1,
            letterSpacing: 1,
          }}
        >
          {layout.layoutTitle}
        </Typography>

        <IconButton
          onClick={() => onPreview(layout)}
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#F5F5F5" },
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
