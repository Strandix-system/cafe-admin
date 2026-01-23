import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

export default function AdminDashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Cafe Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Today's Orders</Typography>
              <Typography variant="h4">56</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Today's Earnings</Typography>
              <Typography variant="h4">₹4,250</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Most Ordered Item</Typography>
              <Typography variant="h5">Cappuccino</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
