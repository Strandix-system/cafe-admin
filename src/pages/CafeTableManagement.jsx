import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Download, QrCode } from "lucide-react";
import TableComponent from "../components/TableComponent/TableComponent";
import InputField from "../components/common/InputField";
import toast from "react-hot-toast";
import { useFetch, usePost } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";
import { queryClient } from "../lib/queryClient";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const CafeTableManagement = () => {
  const { layoutId: urlLayoutId } = useParams();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [totalTables, setTotalTables] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  const { data: qrCodesData, refetch } = useFetch(
    "get-qr-codes",
    API_ROUTES.getQRCodes,
    { adminId: user?.id },
    {
      enabled: !!user?.id,
    }
  );

  // Create QR codes mutation
  const { mutate: createQRCodes, isPending: isCreating } = usePost(
    API_ROUTES.createQRCodes,
    {
      onSuccess: () => {
        toast.success("QR codes generated successfully!");
        setOpenDialog(false);
        setTotalTables("");
        setErrors({});

        // Clear URL param if it exists
        if (urlLayoutId) {
          navigate("/qr-codes", { replace: true });
        }

        queryClient.invalidateQueries({ queryKey: ["get-qr-codes"] });
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to generate QR codes");
      },
    }
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "tableNumber",
        header: "Table Number",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <QrCode size={18} color="#6F4E37" />
            <Typography>Table {row.original.tableNumber}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: "qrCodeUrl",
        header: "QR Code",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {row.original.qrCodeUrl ? (
              <img
                src={row.original.qrCodeUrl}
                alt={`QR Code for Table ${row.original.tableNumber}`}
                style={{ width: 60, height: 60, objectFit: "contain" }}
              />
            ) : (
              <Typography
                variant="caption"
                sx={{ color: "#999", fontStyle: "italic" }}
              >
                No QR Code
              </Typography>
            )}
          </Box>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
    ],
    []
  );

  const actions = [
    {
      label: "Download QR",
      icon: Download,
      onClick: (row) => {
        if (row.original.qrCodeUrl) {
          const link = document.createElement("a");
          link.href = row.original.qrCodeUrl;
          link.download = `table-${row.original.tableNumber}-qr.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success(
            `QR code for Table ${row.original.tableNumber} downloaded!`
          );
        }
      },
      color: "#6F4E37",
    },
  ];

  const maxExistingTableNumber = useMemo(() => {
    if (qrCodesData?.result?.totalResults === 0) return 0;
    return qrCodesData?.result?.totalResults;
  }, [qrCodesData]);

  const validateForm = () => {
    const newErrors = {};
    const selectedTotal = Number(totalTables);

    if (!totalTables) {
      newErrors.totalTables = "Please select number of tables";
    } else if (isNaN(selectedTotal)) {
      newErrors.totalTables = "Invalid number";
    } else if (selectedTotal <= maxExistingTableNumber) {
      newErrors.totalTables = `Tables 1-${maxExistingTableNumber} already have QR codes. Please select a number greater than ${maxExistingTableNumber}.`;
    } else if (selectedTotal > 50) {
      newErrors.totalTables = "Maximum 50 tables allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = () => {
    if (validateForm()) {
      createQRCodes({
        totalTables: Number(totalTables),
        adminId: user?.id,
      });
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTotalTables("");
    setErrors({});

    // Clear URL param if it exists
    if (urlLayoutId) {
      navigate("/qr-codes", { replace: true });
    }
  };

  return (
    <div>
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" sx={{ color: "#6F4E37", fontWeight: 600 }}>
          Table Management
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#6F4E37" }}
          onClick={handleOpenDialog}
        >
          Generate QR Codes
        </Button>
      </Box>

      <TableComponent
        slug="QR Code"
        columns={columns}
        actions={actions}
        params={{ adminId: user?.id }}
        actionsType="icons"
        querykey="get-qr-codes"
        getApiEndPoint="getQRCodes"
        enableExportTable={true}
        serialNo={true}
      />

      {/* Generate QR Codes Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !isCreating && handleCloseDialog()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#6F4E37", fontWeight: 600 }}>
          Generate QR Codes for Tables
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {maxExistingTableNumber > 0 && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "#FFF4E6",
                  borderRadius: 2,
                  border: "1px solid #FFB74D",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#E65100",
                    fontWeight: 600,
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Existing QR Codes
                </Typography>
                <Typography variant="body2" sx={{ color: "#E65100" }}>
                  Tables 1-{maxExistingTableNumber} already have QR codes for
                  your cafe
                </Typography>
              </Box>
            )}

            {/* Number of Tables Dropdown */}
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, color: "#666", fontWeight: 500 }}
              >
                Number of Tables
              </Typography>
              <Typography
                variant="caption"
                sx={{ mb: 2, display: "block", color: "#888" }}
              >
                {maxExistingTableNumber > 0
                  ? `Select a number greater than ${maxExistingTableNumber} to continue generating QR codes.`
                  : "Table numbering will start from 1."}
              </Typography>
              <InputField
                select
                field={{
                  value: totalTables,
                  onChange: (e) => {
                    setTotalTables(e.target.value);
                    setErrors((prev) => ({ ...prev, totalTables: undefined }));
                  },
                }}
                error={errors.totalTables}
                helperText={errors.totalTables}
                disabled={isCreating}
                SelectProps={{ native: true }}
              >
                <option value="">Select number of tables</option>

                {Array.from({ length: 50 }, (_, i) => {
                  const num = i + 1;
                  const isDisabled = num <= maxExistingTableNumber;

                  return (
                    <option key={num} value={num} disabled={isDisabled}>
                      {num} {isDisabled ? "(Already created)" : ""}
                    </option>
                  );
                })}
              </InputField>

              {totalTables && !errors.totalTables && (
                <Typography
                  variant="caption"
                  sx={{ mt: 1, display: "block", color: "#6F4E37" }}
                >
                  This will generate QR codes for tables{" "}
                  {maxExistingTableNumber > 0
                    ? `${maxExistingTableNumber + 1}-${totalTables}`
                    : `1-${totalTables}`}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={isCreating}
            sx={{ color: "#666" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: "#6F4E37" }}
            disabled={isCreating || !totalTables}
          >
            {isCreating ? "Generating..." : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CafeTableManagement;
