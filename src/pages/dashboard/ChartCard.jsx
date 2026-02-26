import { Card, Box, Typography } from "@mui/material";

export default function ChartCard({ title,action, children }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        height: "100%",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
      }}
    >

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography fontSize={25} fontWeight={600}>
          {title}
        </Typography>

        {action && <Box>{action}</Box>}
      </Box>

      <Box>{children}</Box>
    </Card>
  );
}
