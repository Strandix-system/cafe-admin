import { TableComponent } from "../../components/TableComponent/TableComponent";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const PaymentHistory = () => {
  const { adminId } = useParams();

  const columns = useMemo(
    () => [
      {
        id: "cafeName",
        header: "Cafe Name",
        Cell: ({ row }) => row.original.user?.cafeName || "-",
      },
      {
        accessorKey: "razorpayPaymentId",
        header: "Payment ID",
      },
      {
        accessorKey: "paidAt",
        header: "Payment Date",
        Cell: ({ row }) =>
          row.original.subscriptionStartDate
            ? new Date(row.original.subscriptionStartDate).toLocaleDateString()
            : "-",
      },
      {
        id: "expiryDate",
        header: "Expiry Date",
        Cell: ({ row }) =>
          row.original.subscriptionEndDate
            ? new Date(row.original.subscriptionEndDate).toLocaleDateString()
            : "-", // Not available from backend yet
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
            {row.original.status === "captured" ? "Paid" : row.original.status}
          </span>
        ),
      },
    ],
    [],
  );

  const querykey = adminId ? `get-transactions-${adminId}` : "get-transactions";

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
          columns={columns}
          querykey={querykey}
          getApiEndPoint="getTransactions"
          params={adminId ? { adminId } : {}}
          manualPagination={true}
          serialNo={true}
          enableExportTable={true}
        />
      </Box>
    </div>
  );
};
