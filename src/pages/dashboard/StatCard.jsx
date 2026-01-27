import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({label, value, loading }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        bgcolor: "#F5EFE6",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          gutterBottom
        >
          {label}
        </Typography>

        <Typography variant="h5" fontWeight={700} color="#6F4E37">
          {loading ? "—" : value}
        </Typography>
      </CardContent>
    </Card>
  );
}

