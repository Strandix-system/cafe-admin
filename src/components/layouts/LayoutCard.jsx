import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

export default function LayoutCard({ layout, onPreview }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Title */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {layout.title}
        </Typography>

        {/* Admin info */}
        <Typography variant="body2" color="text.secondary">
          Admin ID: <strong>{layout.adminId}</strong>
        </Typography>

        {/* Image count */}
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <ImageIcon fontSize="small" />
          <Typography variant="body2">
            {layout.imageCount || layout.images?.length || 0} Images
          </Typography>
        </Stack>

        {/* Layout type (future-proof) */}
        {layout.type && (
          <Chip
            label={layout.type}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>

      {/* Actions */}
      <Box px={2} pb={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => onPreview(layout)}
        >
          Preview
        </Button>
      </Box>
    </Card>
  );
}
