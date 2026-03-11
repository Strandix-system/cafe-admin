import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TableComponent } from "../../components/TableComponent/TableComponent";
import { formatToLocalDateTime } from "../../utils/utils";

export const PaymentHistory = () => {
  const { adminId } = useParams();
  const { isSuperAdmin } = useAuth();

  const columns = useMemo(
    () => [
      ...(isSuperAdmin && !adminId
        ? [
            {
              id: "cafeName",
              header: "Cafe Name",
              Cell: ({ row }) => row.original.user?.cafeName ?? "-",
            },
          ]
        : []),

      {
        accessorKey: "razorpayPaymentId",
        header: "Payment ID",
      },
      {
        accessorKey: "paidAt",
        header: "Payment Date",
        Cell: ({ row }) =>
          formatToLocalDateTime(row.original.subscriptionStartDate),
      },
      {
        id: "expiryDate",
        header: "Expiry Date",
        Cell: ({ row }) =>
          formatToLocalDateTime(row.original.subscriptionEndDate),
      },
      {
        accessorKey: "amount",
        header: "Amount Paid",
        Cell: ({ row }) =>
          row.original.amount ? `₹ ${row.original.amount / 100}` : "₹ 0",
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
    [isSuperAdmin, adminId],
  );

  const querykey = adminId ? `get-transactions-${adminId}` : "get-transactions";

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Payment History</h1>
      </div>

      {/* Table Container */}
      <div className="w-full bg-[#FAF7F2] min-h-screen p-6">
        <TableComponent
          columns={columns}
          querykey={querykey}
          getApiEndPoint="getTransactions"
          params={adminId ? { adminId } : {}}
          manualPagination={true}
          enableExportTable={true}
        />
      </div>
    </div>
  );
};
