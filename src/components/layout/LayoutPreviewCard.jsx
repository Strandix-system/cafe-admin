import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Radio,
  Typography,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

export default function LayoutPreviewCard({
  layout,
  isActive,
  isSelected,
  onSelect,
  onSetActive,
  onEdit, // Only used for "My Layouts" section
  onPreview,
  showEditButton = false, // New prop to control edit button visibility
}) {
  return (
    <Card
      onClick={() => onSelect(layout._id)} // Select for top button action
      sx={{
        position: "relative",
        width: 260,
        height: 180,
        borderRadius: 3,
        overflow: "hidden",
        border: isActive
          ? "3px solid #4CAF50"
          : isSelected
            ? "3px solid #6F4E37"
            : "1px solid #ddd",

        boxShadow: isActive
          ? "0 0 0 2px rgba(76, 175, 80, 0.3), 0 8px 20px rgba(0,0,0,0.15)"
          : "0 4px 10px rgba(0,0,0,0.1)",
        transition: "0.3s",
        cursor: "pointer",
        "&:hover .overlay": {
          opacity: 1,
        },
      }}
    >
      {/* RADIO BUTTON (TOP RIGHT) */}
      {/* For SuperAdmin/Default Templates: Used for selection (brown border) */}
      {/* For My Layouts: Used to set active (green border) */}
      <Tooltip
        title={
          showEditButton
            ? isActive
              ? "Active Layout"
              : "Set as Active"
            : "Select Layout"
        }
      >
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 101,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Radio
            checked={showEditButton ? isActive : isSelected}
            onChange={() => {
              if (showEditButton) {
                if (!isActive && onSetActive) {
                  onSetActive(layout._id);
                }
              } else {
                onSelect(layout._id);
              }
            }}
            sx={{
              color: showEditButton ? "#4CAF50" : "#6F4E37",
              "&.Mui-checked": {
                color: showEditButton ? "#4CAF50" : "#6F4E37",
              },
            }}
          />
        </Box>
      </Tooltip>

      {isActive && showEditButton && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: "#4CAF50",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            zIndex: 101,
            boxShadow: 2,
          }}
        >
          ACTIVE
        </Box>
      )}

      {/* HOME IMAGE */}
      <CardMedia
        component="img"
        className="h-full"
        image={layout.homeImage}
        alt={layout.layoutTitle}
      />

      {isActive && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.05))",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* HOVER OVERLAY */}
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
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 100,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: 2,
            letterSpacing: 1,
          }}
        >
          {layout.layoutTitle}
        </Typography>

        {/* ACTION BUTTONS */}
        <Box display="flex" gap={1}>
          {/* PREVIEW BUTTON */}
          <Tooltip title="Preview">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onPreview(layout);
              }}
              sx={{
                bgcolor: "white",
                boxShadow: 2,
                "&:hover": { bgcolor: "#F5F5F5" },
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          {/* EDIT BUTTON - Only shown for "My Layouts" section */}
          {showEditButton && onEdit && (
            <Tooltip title="Edit Layout">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(layout._id);
                }}
                sx={{
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#F5F5F5" },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Card>
  );
}