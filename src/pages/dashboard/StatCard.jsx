
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useEffect, useState } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PaidIcon from "@mui/icons-material/Paid";
import StoreIcon from "@mui/icons-material/Store";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BlockIcon from "@mui/icons-material/Block";
import AssignmentIcon from "@mui/icons-material/Assignment";

const shade = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `rgb(
    ${Math.min(255, Math.max(0, R))},
    ${Math.min(255, Math.max(0, G))},
    ${Math.min(255, Math.max(0, B))}
  )`;
};

const THEME_COLOR = "#6F4E37";

const ICON_MAP = {
  // Admin stats
  "Total Customers": PeopleAltIcon,
  "Today's Customers": PersonAddAltIcon,

  "Total Orders": ReceiptLongIcon,
  "Today's Orders": ShoppingCartIcon,

  "Total Income": PaidIcon,
  "Today's Income": CurrencyRupeeIcon,

  // Super Admin stats
  "Total Cafes": StoreIcon,
  "Active Cafes": StorefrontIcon,
  "Inactive Cafes": BlockIcon,
    "Total Demo Requests": AssignmentIcon,
};

export default function StatCard({ label, value, loading }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [animate, setAnimate] = useState(false);

  const IconComponent = ICON_MAP[label] || TrendingUpIcon;

  /* 🔢 Count-up animation */
  useEffect(() => {
    if (loading) return;

    const end = Number(value?.toString().replace(/[^\d]/g, "")) || 0;
    let start = 0;
    const duration = 700;
    const step = Math.max(Math.floor(end / 30), 1);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);

        setAnimate(true);
        setTimeout(() => setAnimate(false), 250);
      } else {
        setDisplayValue(start);
      }
    }, duration / 30);

    return () => clearInterval(timer);
  }, [value, loading]);

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        // backgroundColor: THEME_COLOR, 
        background: `
  linear-gradient(
    145deg,
    ${shade(THEME_COLOR, 50)},
    ${shade(THEME_COLOR, 70)},
    ${shade(THEME_COLOR, -8)}
  )
`,
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        transition: "all 0.35s ease",

        /* 🔥 Hover lift */
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
        },

        /* 🔥 SHIMMER ANIMATION */
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
          transform: "translateX(-100%)",
          animation: "shimmer 5s ease-in-out infinite",
        },

        "@keyframes shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "40%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(100%)" },
        },

        "@media (prefers-reduced-motion: reduce)": {
          "&::after": { animation: "none" },
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "#6F4E37",
              letterSpacing: 0.4,
            }}
          >
            {label}
          </Typography>

          <Box
            sx={{
              bgcolor:"rgba(111, 78, 55, 0.18)",
              borderRadius: "50%",
              p: 1,
              display: "flex",
            }}
          >
            {/* <TrendingUpIcon sx={{ fontSize: 18, color: "#5C3A26", }} /> */}
            <IconComponent sx={{ fontSize: 18, color: "#5C3A26" }} />
          </Box>
        </Box>

        {/* Value */}
        {loading ? (
          <Skeleton variant="text" width={100} height={40} />
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#4B2F1E",
              letterSpacing: 0.5,
              transform: animate ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.25s ease",
            }}
          >
            {label.toLowerCase().includes("income")
              ? `₹${displayValue.toLocaleString("en-IN")}`
              : displayValue}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}