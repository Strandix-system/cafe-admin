import { useState, useMemo } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { Plus, Download, QrCode } from "lucide-react";
import TableComponent from "../components/TableComponent/TableComponent";
import toast from "react-hot-toast";
import { useFetch, usePost } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";
import { queryClient } from "../lib/queryClient";
import { useAuth } from "../context/AuthContext";

const CafeTableManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [totalTables, settotalTables] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  const { data: qrCodesData } = useFetch(
    "get-qr-codes",
    API_ROUTES.getQRCodes,
    queryClient.invalidateQueries({ queryKey: ["get-qr-codes"] }),
    { adminId: user?.id },
    { 
      enabled: !!user?.id,
      // Transform the data to match TableComponent's expected format
      select: (data) => {
        if (!data?.result) return { result: { qrs: [], totalResults: 0 } };
        
        return {
          result: {
            results: data.result, // Put the array in results
            totalResults: data.result.length // Add totalResults count
          }
        };
      }
    }
  );
  console.log("Fetched QR Codes Data:", qrCodesData);
  // Create QR codes mutation
  const { mutate: createQRCodes, isPending: isCreating } = usePost(
    API_ROUTES.createQRCodes,
    {
      onSuccess: () => {
        toast.success("QR codes generated successfully!");
        setOpenDialog(false);
        settotalTables("");
        setErrors({});
        queryClient.invalidateQueries({ queryKey: ["get-qr-codes"] });
      },
      onError: (error) => {
        console.error("Full error object:", error);
        console.error("Error message:", error?.message);
        console.error("Error response:", error?.response);
        toast.error(error?.message || "Failed to generate QR codes");
      }
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
              <Typography variant="caption" sx={{ color: "#999", fontStyle: "italic" }}>
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
          toast.success(`QR code for Table ${row.original.tableNumber} downloaded!`);
        }
      },
      color: "#6F4E37",
    },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
    settotalTables("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const range = parseInt(totalTables);

    if (!totalTables) {
      newErrors.totalTables = "Please enter the number of tables";
    } else if (isNaN(range) || range < 1) {
      newErrors.totalTables = "Please enter a valid number greater than 0";
    } else if (range > 500) {
      newErrors.totalTables = "Maximum 500 tables can be created at once";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const range = parseInt(totalTables);
      createQRCodes({
        totalTables: range,
        adminId: user?.id,
      });
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
          startIcon={<Plus size={18} />}
          onClick={handleOpenDialog}
        >
          Generate QR Codes
        </Button>
      </Box>

      <TableComponent
        slug="QR Code"
        columns={columns}
        actions={actions}
        actionsType="icons"
        querykey="get-qr-codes"
        getApiEndPoint="getQRCodes"
        enableExportTable={true}
        serialNo={true}
        params={{ adminId: user?.id }}
        data={qrCodesData}
      />

      {/* Generate QR Codes Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => !isCreating && setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#6F4E37", fontWeight: 600 }}>
          Generate QR Codes for Tables
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              Enter the number of tables for which you want to generate QR codes.
              Table numbering will start from 1.
            </Typography>
            <TextField
              fullWidth
              label="Number of Tables"
              type="number"
              value={totalTables}
              onChange={(e) => {
                settotalTables(e.target.value);
                setErrors({});
              }}
              error={!!errors.totalTables}
              helperText={errors.totalTables}
              placeholder="e.g., 10"
              InputProps={{
                inputProps: { min: 1, max: 500 }
              }}
              disabled={isCreating}
            />
            {totalTables && !errors.totalTables && (
              <Typography variant="caption" sx={{ mt: 1, display: "block", color: "#6F4E37" }}>
                This will generate QR codes for tables 1 to {totalTables}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={isCreating}
            sx={{ color: "#666" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: "#6F4E37" }}
            disabled={isCreating}
          >
            {isCreating ? "Generating..." : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CafeTableManagement;