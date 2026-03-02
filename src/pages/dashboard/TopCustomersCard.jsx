import { Card, Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../context/AuthContext";

const THEME_COLOR = "#6F4E37";

export default function TopCustomersCard({ customersDataOverride }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const shouldFetch = !Array.isArray(customersDataOverride);

    const { data } = useFetch(
        ["top-customers", user?._id],
        API_ROUTES.dashboardTopCustomers,
        {},
        { enabled: shouldFetch && !!user?._id }
    );

    const customers = Array.isArray(customersDataOverride)
        ? customersDataOverride
        : data?.result ?? [];

    if (customers.length === 0) {
        return null;
    }

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
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                <PersonIcon sx={{ color: THEME_COLOR, fontSize: 22 }} />
                <Typography fontSize={18} fontWeight={600}>
                    Top Customers
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridAutoRows: "minmax(42px, auto)",
                    flex: 1,
                }}
            >
                {customers.map((customer, index) => (
                    <Box
                        key={customer.customerId || `${customer.name}-${index}`}
                        onClick={() => customer.customerId && navigate(`/my-orders/${customer.customerId}`)}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "32px 1fr auto",
                            alignItems: "center",
                            gap: 1.2,
                            cursor: customer.customerId ? "pointer" : "default",
                            px: 1,
                            py: 0.75,
                            borderRadius: 1,
                            "&:hover": {
                                backgroundColor: customer.customerId ? `${THEME_COLOR}10` : "transparent",
                            },
                        }}
                    >
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
                            Rs {Number(customer.totalAmount || 0).toLocaleString("en-IN")}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Card>
    );
}