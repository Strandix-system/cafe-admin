import { TableComponent } from "../../components/TableComponent/TableComponent";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";

export const PaymentHistory = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "razorpayPaymentId",
        header: "Payment ID",
      },
      {
        accessorKey: "paidAt",
        header: "Payment Date",
        Cell: ({ row }) =>
          row.original.paidAt
            ? new Date(row.original.paidAt).toLocaleDateString()
            : "-",
      },
      {
        id: "expiryDate",
        header: "Expiry Date",
        Cell: () => "-", // Not available from backend yet
      },
      {
        accessorKey: "amount",
        header: "Amount Paid",
        Cell: ({ row }) =>
          row.original.amount
            ? `₹ ${row.original.amount / 100}` // Razorpay amount is in paise
            : "₹ 0",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              row.original.status === "captured"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ color: "#333" }}>
          Payment History
        </Typography>
      </Box>

      {/* Table */}
      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>
        <TableComponent
          slug="transactions"
          columns={columns}
          querykey="get-transactions"
          getApiEndPoint="getTransactions"
          manualPagination={true}
          serialNo={true}
          enableExportTable={true}
        />
      </Box>
    </div>
  );
};
