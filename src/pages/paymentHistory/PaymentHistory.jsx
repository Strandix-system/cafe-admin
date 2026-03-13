import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TableComponent } from "../../components/TableComponent/TableComponent";
import { formatToLocalDateTime } from "../../utils/utils";
import { CommonChip } from "../../components/common/CommonChip";

export const PaymentHistory = () => {
  const { userId } = useParams();
  const { isSuperAdmin } = useAuth();

  const columns = useMemo(
    () => [
      ...(isSuperAdmin && !userId
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
        accessorKey: "description",
        header: "Description",
        Cell: ({ row }) => row.original.description ?? "-",
      },
      {
        accessorKey: "amount",
        header: "Amount Paid",
        Cell: ({ row }) =>
          row.original.amount ? `₹ ${row.original.amount / 100}` : "₹ 0",
      },
      {
        id: "status",
        header: "Status",
        Cell: ({ row }) => {
          const status = row.original.raw?.status;

          return (
            <CommonChip
              label={status === "captured" ? "Paid" : (status ?? "-")}
              variant="success"
            />
          );
        },
      },
    ],
    [isSuperAdmin, userId],
  );

  const querykey = userId ? `get-transactions-${userId}` : "get-transactions";

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
          params={userId ? { userId } : {}}
          manualPagination={true}
          enableExportTable={true}
        />
      </div>
    </div>
  );
};
