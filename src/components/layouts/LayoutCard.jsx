// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Stack,
//   Box,
//   Chip,
// } from "@mui/material";
// import ImageIcon from "@mui/icons-material/Image";

// export default function LayoutCard({ layout, onPreview }) {
//   return (
//     <Card
//       sx={{
//         borderRadius: 3,
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <CardContent sx={{ flexGrow: 1 }}>
//         {/* Title */}
//         <Typography variant="h6" fontWeight={600} gutterBottom>
//           {layout.title}
//         </Typography>

//         {/* Admin info */}
//         <Typography variant="body2" color="text.secondary">
//           Admin ID: <strong>{layout.adminId}</strong>
//         </Typography>

//         {/* Image count */}
//         <Stack direction="row" alignItems="center" spacing={1} mt={1}>
//           <ImageIcon fontSize="small" />
//           <Typography variant="body2">
//             {layout.imageCount || layout.images?.length || 0} Images
//           </Typography>
//         </Stack>

//         {/* Layout type (future-proof) */}
//         {layout.type && (
//           <Chip
//             label={layout.type}
//             size="small"
//             sx={{ mt: 1 }}
//           />
//         )}
//       </CardContent>

//       {/* Actions */}
//       <Box px={2} pb={2}>
//         <Button
//           fullWidth
//           variant="outlined"
//           onClick={() => onPreview(layout)}
//         >
//           Preview
//         </Button>
//       </Box>
//     </Card>
//   );
// }

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Stack,
  Radio,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";

export default function LayoutCard({
  layout,
  onPreview,
  onEdit,
  onDelete,
  showHoverActions = false,
  selectable = false,
  selected = false,
  onSelect,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hover, setHover] = useState(false);

  const openMenu = Boolean(anchorEl);

  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        position: "relative",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {selectable && (
        <Radio
          checked={selected}
          onChange={() => onSelect?.(layout)}
          sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
      >
        {onEdit && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onEdit(layout);
            }}
          >
            Edit
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onDelete(layout);
            }}
          >
            Delete
          </MenuItem>
        )}
      </Menu>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {layout.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Admin ID: <strong>{layout.adminId}</strong>
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <ImageIcon fontSize="small" />
          <Typography variant="body2">
            {layout.imageCount || layout.images?.length || 0} Images
          </Typography>
        </Stack>

        {layout.type && (
          <Chip label={layout.type} size="small" sx={{ mt: 1 }} />
        )}
      </CardContent>

      {/* Hover overlay actions */}
      {showHoverActions && (hover || openMenu) && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            gap: 2,
          }}
        >
          {onPreview && (
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              onClick={() => onPreview(layout)}
            >
              Preview
            </Button>
          )}
          {(onEdit || onDelete) && (
            <IconButton
              sx={{ bgcolor: "#fff" }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Card>
  );
}
