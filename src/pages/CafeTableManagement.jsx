import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Download, QrCode } from "lucide-react";
import TableComponent from "../components/TableComponent/TableComponent";
import toast from "react-hot-toast";
import { useFetch, usePost } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";
import { queryClient } from "../lib/queryClient";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const CafeTableManagement = () => {
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [totalTables, setTotalTables] = useState("");
  const [selectedLayoutId, setSelectedLayoutId] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  // Fetch admin's layouts
  const { data: layoutsData, isLoading: layoutsLoading } = useFetch(
    "admin-layouts",
    API_ROUTES.getLayoutByAdmin,
    {},
    {
      adminId: user?.id,
    },
    {
      enabled: !!user?.id,
    },
  );

  // Auto-open dialog if coming from layout creation with layoutId
  useEffect(() => {
    if (location.state?.layoutId) {
      setSelectedLayoutId(location.state.layoutId);
      setOpenDialog(true);
      // Clear the location state to prevent re-opening on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Create QR codes mutation
  const { mutate: createQRCodes, isPending: isCreating } = usePost(
    API_ROUTES.createQRCodes,
    {
      onSuccess: () => {
        toast.success("QR codes generated successfully!");
        setOpenDialog(false);
        setTotalTables("");
        setSelectedLayoutId("");
        setErrors({});
        queryClient.invalidateQueries({ queryKey: ["get-qr-codes"] });
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to generate QR codes");
      },
    },
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
    [],
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
            `QR code for Table ${row.original.tableNumber} downloaded!`,
          );
        }
      },
      color: "#6F4E37",
    },
  ];

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

    if (!selectedLayoutId) {
      newErrors.layoutId = "No layout selected. Please create a layout first.";
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
        layoutId: selectedLayoutId,
      });
    }
  };

  const availableLayouts = layoutsData?.result || [];

  const handleOpenDialog = () => {
    if (availableLayouts.length === 0) {
      toast.error("No layouts available. Please create a layout first.");
      return;
    }

    // If there's only one layout and no layout is selected, auto-select it
    if (availableLayouts.length === 1 && !selectedLayoutId) {
      const layoutId = availableLayouts[0]._id || availableLayouts[0].id;
      setSelectedLayoutId(layoutId);
    }

    setOpenDialog(true);
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
        params={{ adminId: user?.id, populate: "layoutId" }}
        actionsType="icons"
        querykey="get-qr-codes"
        getApiEndPoint="getQRCodes"
        enableExportTable={true}
        serialNo={true}
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
            {/* Display selected layout info */}
            {selectedLayoutId && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "#F5EFE6",
                  borderRadius: 2,
                  border: "1px solid #6F4E37",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#6F4E37",
                    fontWeight: 600,
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Selected Layout
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#6F4E37", fontWeight: 500 }}
                >
                  {availableLayouts.find(
                    (l) => (l._id || l.id) === selectedLayoutId,
                  )?.layoutTitle || "Loading..."}
                </Typography>
              </Box>
            )}

            {/* Number of Tables */}
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                Enter the number of tables for which you want to generate QR
                codes. Table numbering will start from 1.
              </Typography>
              <TextField
                fullWidth
                label="Number of Tables"
                type="number"
                value={totalTables}
                onChange={(e) => {
                  setTotalTables(e.target.value);
                  setErrors((prev) => ({ ...prev, totalTables: undefined }));
                }}
                error={!!errors.totalTables}
                helperText={errors.totalTables}
                placeholder="e.g., 10"
                InputProps={{
                  inputProps: { min: 1, max: 500 },
                }}
                disabled={isCreating}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F5EFE6",
                    borderRadius: 2,
                  },
                }}
              />
              {totalTables && !errors.totalTables && (
                <Typography
                  variant="caption"
                  sx={{ mt: 1, display: "block", color: "#6F4E37" }}
                >
                  This will generate QR codes for tables 1 to {totalTables}
                </Typography>
              )}
            </Box>

            {/* Show error if no layout is selected */}
            {errors.layoutId && (
              <Typography
                variant="caption"
                sx={{ mt: 2, display: "block", color: "error.main" }}
              >
                {errors.layoutId}
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
