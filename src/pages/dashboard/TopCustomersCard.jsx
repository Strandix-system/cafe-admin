
import { Card, Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import PersonIcon from "@mui/icons-material/Person";

const THEME_COLOR = "#6F4E37";

export default function TopCustomersCard() {
    const navigate = useNavigate();

    const { data } = useFetch(
        ["top-customers"],
        API_ROUTES.dashboardTopCustomers
    );

    const customers = data?.result ?? [];

    return (
        <Card
            sx={{
                borderRadius: 3,
                p: 2,
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
        >
            {/* HEADER */}
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                <PersonIcon sx={{ color: THEME_COLOR, fontSize: 22 }} />
                <Typography fontSize={18} fontWeight={600}>
                    Top Customers
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    // gridTemplateRows: `repeat(${customers.length}, 1fr)`,
                    gridAutoRows: "minmax(42px, auto)",
                    //   gap: "1px", 
                    flex: 1,
                }}
            >
                {customers.map((customer, index) => (
                    <Box
                        key={customer.customerId}
                        onClick={() => navigate(`/my-orders/${customer.customerId}`)}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "32px 1fr auto",
                            alignItems: "center",
                            gap: 1.2,
                            cursor: "pointer",
                            px: 1,
                            py: 0.6,           // 🔑 reduced vertical padding
                            borderRadius: 1,
                            "&:hover": {
                                backgroundColor: `${THEME_COLOR}10`,
                            },
                        }}
                    >
                        {/* RANK */}
                        <Avatar
                            sx={{
                                width: 22,
                                height: 22,
                                fontSize: 11,
                                bgcolor: THEME_COLOR,
                            }}
                        >
                            {index + 1}
                        </Avatar>

                        <Box>
                            <Typography fontSize={13.5} fontWeight={600} noWrap>
                                {customer.name}
                            </Typography>
                            <Typography fontSize={11} color="text.secondary">
                                Total Orders: {customer.totalOrders}
                            </Typography>
                        </Box>

                        <Typography fontSize={13} fontWeight={600}>
                            ₹{customer.totalAmount}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Card>
    );
}