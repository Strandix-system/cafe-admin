import { useState, useMemo } from "react";
import { usePatch } from "../../utils/hooks/api_hooks";
import {
    Typography,
    Grid,
    Chip,
    Box,
    Tabs,
    Tab,
    Dialog,
    DialogContent,
    IconButton,
} from "@mui/material";
import { TableComponent } from "../../components/TableComponent/TableComponent"
import {
    CheckCircle,
    UserCog2,
    ChevronLeft,
    ChevronRight,
    X,
    ImageOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { API_ROUTES } from "../../utils/api_constants";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { queryClient } from "../../lib/queryClient";
import { CommonButton } from "../../components/common/commonButton";
import SupportForm from "./SupportForm";
export default function SupportTicketList() {
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [sliderOpen, setSliderOpen] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);
    const [sliderIndex, setSliderIndex] = useState(0);
    
    const { user, isSuperAdmin } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("status") || "pending";
    const [supportOpen, setSupportOpen] = useState(false);

    const handleTabChange = (_, newStatus) => {
        setSearchParams({ status: newStatus });
    };

    // const queryKey = isSuperAdmin
    //     ? `get-support-tickets-${status}`
    //     : `get-support-tickets-${user?.id}-${status}`;
    const queryKey = ["support-tickets", status];
    // const params = isSuperAdmin ? { status } : { userId: user?.id, status };

    const params = { status }
    const { mutate: updateTicketStatus } = usePatch(
        selectedTicketId
            ? `${API_ROUTES.updateSupportTicket}/${selectedTicketId}`
            : null,
        {
            onSuccess: (_, variables) => {
                toast.success(
                    `Ticket marked as ${{ resolved: "Resolved", in_process: "In Process" }[
                    variables.status
                    ]
                    }`,
                );
                queryClient.invalidateQueries({ queryKey: [queryKey] });
                setSelectedTicketId(null);
            },
            onError: () => {
                toast.error("Something went wrong while updating ticket status");
                setSelectedTicketId(null);
            },
        },
    );

    const handleStatusUpdate = (row, newStatus) => {
        setSelectedTicketId(row.original.ticketId);
        updateTicketStatus({ status: newStatus });
    };

    const openSlider = (images) => {
        setSliderImages(images || []);
        setSliderIndex(0);
        setSliderOpen(true);
    };
    const ticketColumns = useMemo(
        () => [
            { accessorKey: "ticketId", header: "Ticket ID" },
            ...(isSuperAdmin ? [{ accessorKey: "admin.email", header: "Raised By" }] : []),

            { accessorKey: "title", header: "Title" },

            {
                accessorKey: "description",
                header: "Description",
                Cell: ({ row }) =>
                    row.original.description ? (
                        <span className="line-clamp-2">{row.original.description}</span>
                    ) : (
                        "N/A"
                    ),
            },
            {
                id: "images",
                header: "Images",
                Cell: ({ row }) => {
                    const imgs = row.original.images || [];
                    if (!imgs.length) {
                        return (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <ImageOff size={14} /> No image
                            </span>
                        );
                    }
                    return (
                        <Box
                            className="flex items-center gap-1 cursor-pointer "
                            onClick={() => openSlider(imgs)}
                        >
                            {imgs.slice(0, 3).map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`ticket-img-${i}`}
                                    className="w-8 h-8 rounded-md object-cover border border-indigo-100"
                                    style={{ marginLeft: i > 0 ? -10 : 0, zIndex: i }}
                                />
                            ))}
                            <span className="text-xs text-indigo-500 ml-2">
                                {imgs.length} {imgs.length === 1 ? "image" : "images"}
                            </span>
                        </Box>
                    );
                },
            },
            {
                id: "status",
                header: "Status",
                Cell: ({ row }) => {
                    const map = {
                        pending: { bg: "#fff3cd", color: "#d19d06", label: "Pending" },
                        resolved: { bg: "#d1ffbe", color: "#3db309", label: "Resolved" },
                        in_process: {
                            bg: "#e3f2fd",
                            color: "#1976d2",
                            label: "In Process",
                        },
                    };
                    const chip = map[row.original.status] || map.pending;
                    return (
                        <Chip
                            label={chip.label}
                            size="small"
                            sx={{ backgroundColor: chip.bg, color: chip.color }}
                        />
                    );
                },
            },
            {
                accessorKey: "createdAt",
                header: "Date",
                Cell: ({ cell }) =>
                    cell.getValue()
                        ? new Date(cell.getValue()).toLocaleDateString()
                        : "N/A",
            },
        ],
        [isSuperAdmin],
    );

    const ticketActions = useMemo(
        () => [
            {
                label: "Resolve",
                icon: (props) => (
                    <CheckCircle {...props} className="mr-3 text-green-600" />
                ),
                onClick: (row) => handleStatusUpdate(row, "resolved"),
            },
            {
                label: "In Process",
                icon: (props) => <UserCog2 {...props} className="mr-3 text-blue-600" />,
                onClick: (row) => handleStatusUpdate(row, "in_process"),
            },
        ],
        [selectedTicketId],
    );
    const filteredActions = useMemo(() => {
        if (status === "in_process") {
            return ticketActions.filter((action) => action.label !== "In Process");
        }

        if (status === "resolved") {
            return ticketActions.filter((action) => action.label == "In Process"); // no actions for resolved
        }

        return ticketActions;
    }, [status, ticketActions]);

    return (
        <div className="min-h-full flex flex-col overflow-hidden p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Grid container className="mb-4">
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h5" fontWeight={700}>
                        Support Tickets
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} className="flex justify-end">
                    {<CommonButton
                        variant="contained"
                        onClick={() => setSupportOpen(true)}
                    >
                        Support
                    </CommonButton>
                    }
                </Grid>
                <Grid size={12}>

                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                        <Tabs value={status} onChange={handleTabChange}>
                            <Tab label="Pending" value="pending" />
                            <Tab label="In Process" value="in_process" />
                            <Tab label="Resolved" value="resolved" />
                        </Tabs>
                    </Box>
                </Grid>
                <Grid size={12}>
                    <TableComponent
                        slug="support-ticket"
                        columns={ticketColumns}
                        actions={isSuperAdmin ? filteredActions : []}
                        actionsType="menu"
                        querykey={queryKey}
                        getApiEndPoint="getSupportTickets"
                        params={params}
                    />
                </Grid>
            </Grid>
            <SupportForm open={supportOpen} onClose={() => setSupportOpen(false)} />
            {/* Image Slider Dialog */}
            <Dialog
                open={sliderOpen}
                onClose={() => setSliderOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, bgcolor: "#fff" } }}
            >
                <DialogContent sx={{ p: 0, position: "relative" }}>
                    <IconButton
                        onClick={() => setSliderOpen(false)}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 10,
                            color: "#fff",
                            bgcolor: "rgba(0,0,0,0.4)",
                        }}
                    >
                        <X size={18} />
                    </IconButton>
                    {sliderImages.length === 0 ? (
                        <Box className="flex flex-col items-center justify-center py-16 gap-3 border border-red-600 rounded">
                            <ImageOff size={40} color="#666" />
                            <Typography sx={{ color: "#666" }}>
                                No images available
                            </Typography>
                        </Box>
                    ) : (
                        <Box className="flex flex-col items-center">
                            <Box
                                className="relative flex items-center justify-center w-full"
                                sx={{ minHeight: 400 }}
                            >
                                <img
                                    src={sliderImages[sliderIndex]}
                                    alt={`slide-${sliderIndex}`}
                                    className="max-h-[70vh] max-w-full object-contain rounded"
                                />
                                {sliderImages.length > 1 && (
                                    <>
                                        <IconButton
                                            onClick={() =>
                                                setSliderIndex(
                                                    (i) =>
                                                        (i - 1 + sliderImages.length) % sliderImages.length,
                                                )
                                            }
                                            sx={{
                                                position: "absolute",
                                                left: 8,
                                                color: "#fff",
                                                bgcolor: "rgba(0,0,0,0.5)",
                                                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                                            }}
                                        >
                                            <ChevronLeft />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                setSliderIndex((i) => (i + 1) % sliderImages.length)
                                            }
                                            sx={{
                                                position: "absolute",
                                                right: 8,
                                                color: "#fff",
                                                bgcolor: "rgba(0,0,0,0.5)",
                                                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                                            }}
                                        >
                                            <ChevronRight />
                                        </IconButton>
                                    </>
                                )}
                            </Box>

                            {sliderImages.length > 1 && (
                                <Box className="flex items-center gap-2 py-3">
                                    {sliderImages.map((src, i) => (
                                        <Box
                                            key={i}
                                            onClick={() => setSliderIndex(i)}
                                            sx={{
                                                width: i === sliderIndex ? 48 : 36,
                                                height: i === sliderIndex ? 48 : 36,
                                                borderRadius: 1,
                                                overflow: "hidden",
                                                border:
                                                    i === sliderIndex
                                                        ? "2px solid #4f6ef7"
                                                        : "2px solid transparent",
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                                opacity: i === sliderIndex ? 1 : 0.5,
                                            }}
                                        >
                                            <img
                                                src={src}
                                                alt={`thumb-${i}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            <Typography variant="caption" sx={{ color: "#888", pb: 2 }}>
                                {sliderIndex + 1} / {sliderImages.length}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
