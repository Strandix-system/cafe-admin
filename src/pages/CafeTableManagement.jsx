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
  const [selectedLayoutId, setSelectedLayoutId] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  // Fetch admin's layouts
  const { data: layoutData,
    isLoading: layoutsLoading } = useFetch(
      "admin-layouts",
      API_ROUTES.getLayoutByAdmin,
      {},
      {
        adminId: user?.id,
      },
      {
        enabled: !!user?.id,
      }
    );

  const layouts = layoutData?.result?.results || [];


  // Fetch QR codes for the selected layout
  const {
    data: layoutQRCodesData,
    isLoading: qrCodesLoading,
    refetch: refetchLayoutQRCodes,
  } = useFetch(
    `layout-qr-codes-${selectedLayoutId}`,
    API_ROUTES.getQRCodes,
    {},
    {
      adminId: user?.id,
      layoutId: selectedLayoutId,
      populate: "layoutId",
    },
    {
      enabled: !!selectedLayoutId && !!user?.id,
    }
  );
  const qrCodes = layoutQRCodesData?.result?.results || [];

  // Filter existing QR codes for the selected layout
  const existingQRCodesForLayout = useMemo(() => {
    if (!selectedLayoutId || !qrCodes) return [];
    return qrCodes.filter((qr) => qr.layoutId?._id === selectedLayoutId);
  }, [selectedLayoutId, qrCodes]);

  // Get the highest table number already created for this layout
  const maxExistingTableNumber = useMemo(() => {
    if (existingQRCodesForLayout.length === 0) return 0;

    return Math.max(
      ...existingQRCodesForLayout.map((qr) => qr.tableNumber || 0)
    );
  }, [existingQRCodesForLayout]);

  // Auto-open dialog and set layout if coming from layout creation with layoutId
  useEffect(() => {
    if (urlLayoutId) {
      setSelectedLayoutId(urlLayoutId);
      setOpenDialog(true);
    }
  }, [urlLayoutId]);

  // Refetch QR codes when selectedLayoutId changes
  useEffect(() => {
    if (selectedLayoutId) {
      refetchLayoutQRCodes();
    }
  }, [selectedLayoutId, refetchLayoutQRCodes]);

  // Create QR codes mutation
  const { mutate: createQRCodes, isPending: isCreating } = usePost(
    API_ROUTES.createQRCodes,
    {
      onSuccess: () => {
        toast.success("QR codes generated successfully!");
        setOpenDialog(false);
        setTotalTables("");

        // Clear URL param if it exists
        if (urlLayoutId) {
          navigate("/qr-codes", { replace: true });
        }

        setSelectedLayoutId("");
        setErrors({});
        queryClient.invalidateQueries({ queryKey: ["get-qr-codes"] });
        queryClient.invalidateQueries({
          queryKey: [`layout-qr-codes-${selectedLayoutId}`],
        });
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
        accessorKey: "layoutId.layoutTitle",
        header: "Layout",
        Cell: ({ row }) => (
          <Typography>
            {row.original.layoutId?.layoutTitle || "N/A"}
          </Typography>
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

  const validateForm = () => {
    const newErrors = {};
    const range = parseInt(totalTables);

    if (!selectedLayoutId) {
      newErrors.layoutId = "Please select a layout";
    }

    if (!totalTables) {
      newErrors.totalTables = "Please select the number of tables";
    } else if (isNaN(range) || range < 1) {
      newErrors.totalTables = "Please select a valid number";
    } else if (range <= maxExistingTableNumber) {
      newErrors.totalTables = `QR codes already exist for tables 1-${maxExistingTableNumber}. Please select a number greater than ${maxExistingTableNumber}.`;
    } else if (range > 500) {
      newErrors.totalTables = "Maximum 500 tables allowed";
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

  const handleOpenDialog = () => {
    if (!layouts || layouts.length === 0) {
      toast.error("No layouts available. Please create a layout first.");
      return;
    }

    // If there's only one layout and no layout is selected, auto-select it
    if (layouts?.length === 1 && !selectedLayoutId) {
      const layoutId = layouts[0]._id || layouts[0].id; setSelectedLayoutId(layoutId);
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTotalTables("");
    setErrors({});

    // Clear URL param if it exists
    if (urlLayoutId) {
      navigate("/qr-codes", { replace: true });
      setSelectedLayoutId("");
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
        onClose={() => !isCreating && handleCloseDialog()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#6F4E37", fontWeight: 600 }}>
          Generate QR Codes for Tables
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Layout Selection Dropdown */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, color: "#666", fontWeight: 500 }}
              >
                Select Layout
              </Typography>
              <InputField
                select
                field={{
                  value: selectedLayoutId,
                  onChange: (e) => {
                    setSelectedLayoutId(e.target.value);
                    setTotalTables(""); // Reset table count when layout changes
                    setErrors((prev) => ({ ...prev, layoutId: undefined }));
                  },
                }}
                error={errors.layoutId}
                helperText={errors.layoutId}
                disabled={isCreating || !!urlLayoutId} // Disable if coming from URL
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select a layout</option>
                {layouts?.map((layout) => (
                  <option
                    key={layout._id || layout.id}
                    value={layout._id || layout.id}
                  >
                    {layout.layoutTitle}
                  </option>
                ))}
              </InputField>
              {urlLayoutId && (
                <Typography
                  variant="caption"
                  sx={{ mt: 1, display: "block", color: "#6F4E37" }}
                >
                  Layout pre-selected from creation
                </Typography>
              )}
            </Box>

            {/* Show existing QR info if any */}
            {selectedLayoutId && qrCodesLoading && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "#F5F5F5",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Loading existing QR codes...
                </Typography>
              </Box>
            )}

            {selectedLayoutId && !qrCodesLoading && maxExistingTableNumber > 0 && (
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
                  this layout
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
                disabled={isCreating || !selectedLayoutId || qrCodesLoading}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select number of tables</option>
                {Array.from({ length: 500 }, (_, i) => i + 1).map((num) => {
                  const isDisabled = num <= maxExistingTableNumber;

                  return (
                    <option key={num} value={num} disabled={isDisabled}>
                      {num} {isDisabled ? "(Already generated)" : ""}
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
            disabled={isCreating || !selectedLayoutId || !totalTables || qrCodesLoading}
          >
            {isCreating ? "Generating..." : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CafeTableManagement;
