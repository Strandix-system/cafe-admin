import React, { useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    IconButton,
} from "@mui/material";
import { Download, Printer, X } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";

export const OrderBillModal = ({ open, onClose, billId }) => {
    const billRef = useRef(null);

    const { data: { result: billData } = {}, isLoading } = useFetch(
        `bill-${billId}`,
        `${API_ROUTES.getBillById}/${billId}`,
        {},
        {
            enabled: open && !!billId,
        }
    );

    const handleDownload = async () => {
        if (!billRef.current) return;

        const canvas = await html2canvas(billRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(`Bill-${billId}.pdf`);
    };

    const handlePrint = () => {
        if (!billRef.current) return;

        const printContents = billRef.current.innerHTML;
        const newWindow = window.open("", "", "width=800,height=600");

        newWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 6px; text-align: left; }
            th { border-bottom: 1px solid #000; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);

        newWindow.document.close();
        newWindow.print();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Bill Preview
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 10, top: 10 }}
                >
                    <X size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {isLoading ? (
                    <Loader variant="spinner" />
                ) : (
                    <Box ref={billRef} sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" fontWeight="bold">
                            {billData?.cafeName}
                        </Typography>

                        <Typography align="center" variant="body2">
                            {billData?.address}
                        </Typography>

                        <Typography align="center" variant="body2">
                            Table No: {billData?.tableNumber}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box component="table" width="100%">
                            <thead>
                                <tr>
                                    <th align="justify">Items</th>
                                    <th align="center">Qty</th>
                                    <th align="right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billData?.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td align="center">{item.quantity}</td>
                                        <td align="right">₹{item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between">
                            <Typography>Subtotal</Typography>
                            <Typography>₹{billData?.subTotal?.toFixed(2)}</Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between">
                            <Typography fontSize={13}>GST ({billData?.gstPercent}%)</Typography>
                            <Typography>₹{billData?.gstAmount?.toFixed(2)}</Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold">Total</Typography>
                            <Typography fontWeight="bold">
                                ₹{billData?.total?.toFixed(2)}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography align="center" mt={2}>
                            Thank You 🙏
                            <br />
                            Please Visit Again
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button startIcon={<Printer size={16} />} onClick={handlePrint}>
                    Print
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Download size={16} />}
                    onClick={handleDownload}
                >
                    Download PDF
                </Button>
            </DialogActions>
        </Dialog>
    );
};

