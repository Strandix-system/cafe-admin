import { useState, useMemo } from "react";
import { usePut, useFetch, usePatch } from "../../utils/hooks/api_hooks";
import { Typography, Grid, Chip, Box, Tabs, Tab } from "@mui/material";
import { TableComponent } from "../../components/TableComponent/TableComponent";
import { CheckCircle, XCircle, UserCog2 } from "lucide-react";
import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
// import { API_ROUTES } from "@/utils/constants";
import { API_ROUTES } from "../../utils/api_constants";
import { queryClient } from "../../lib/queryClient";

export default function SupportTicketDashboard() {
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [status, setStatus] = useState("pending");

    const { data, isLoading } = useFetch(
        ["get-support-ticket-list"],
        API_ROUTES.getSupportTickets,
    );

    const filteredRows = useMemo(() => {
        const allTickets = data?.result?.results || [];
        return allTickets.filter((ticket) => ticket.status === status);
    }, [data, status]);

    const { mutate: updateTicketStatus } = usePatch(
        selectedTicketId
            ? `${API_ROUTES.updateSupportTicket}/${selectedTicketId}`
            : null,
        {
            onSuccess: (_, variables) => {
                toast.success(
                    `Ticket marked as ${{
                        resolve: "Resolved",
                        in_progress: "In Progress",
                    }[variables.status]
                    }`,
                );

                queryClient.invalidateQueries(["get-support-ticket-list"]);
                setSelectedTicketId(null);
            },
            onError: () => {
                toast.error("Something went wrong while updating ticket status");
                setSelectedTicketId(null);
            },
        },
    );

    const handleStatusUpdate = (row, status) => {
        setSelectedTicketId(row.original.ticketId);
        updateTicketStatus({ status });
    };

    const ticketColumns = useMemo(
        () => [
            { accessorKey: "ticketId", header: "Ticket ID" },
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
                id: "status",
                header: "Status",
                Cell: ({ row }) => {
                    const map = {
                        pending: { bg: "#fff3cd", color: "#d19d06", label: "Pending" },
                        resolve: {
                            bg: "#d1ffbe",
                            color: "#3db309",
                            label: "Resolved",
                        },

                        in_progress: {
                            bg: "#e3f2fd",
                            color: "#1976d2",
                            label: "In Progress",
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
        [],
    );

    const ticketActions = useMemo(
        () => [
            {
                label: "Resolve",
                icon: (props) => (
                    <CheckCircle {...props} className="mr-3 text-green-600" />
                ),
                onClick: (row) => handleStatusUpdate(row, "resolve"),
            },
            {
                label: "In Progress",
                icon: (props) => <UserCog2 {...props} className="mr-3 text-blue-600" />,
                onClick: (row) => handleStatusUpdate(row, "in_progress"),
            },
        ],
        [],
    );

    return (
        <div className="min-h-full flex flex-col overflow-hidden p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Grid container className="mb-4">
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h5" gutterBottom>
                        Support Ticket
                    </Typography>
                </Grid>

                <Grid size={12}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                        <Tabs value={status} onChange={(_, v) => setStatus(v)}>
                            <Tab label="Pending" value="pending" />
                            <Tab label="In Progress" value="in_progress" />
                            <Tab label="Resolved" value="resolve" />
                        </Tabs>
                    </Box>
                </Grid>

                <Grid xs={12}>
                    <TableComponent
                        rows={filteredRows}
                        isDataLoading={isLoading}
                        columns={ticketColumns}
                        actions={ticketActions}
                        actionsType="menu"
                    />
                </Grid>
            </Grid>
        </div>
    );
}