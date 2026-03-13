import { Box, Typography, Tabs, Tab, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import { API_ROUTES } from "../../utils/api_constants";
import { usePatch } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { queryClient } from "../../lib/queryClient";
import dayjs from "dayjs";
import { TableComponent } from "../../components/TableComponent/TableComponent";
import { CommonChip } from "../../components/common/CommonChip";

const STATUS_TABS = [
  { label: "Requested", value: "requested" },
  { label: "Inquiry", value: "inquiry" },
  { label: "Full Filled", value: "full_filled" },
  { label: "Not Interested", value: "not_interested" },
];
export const Enquiries = () => {
  const [activeTab, setActiveTab] = useState("requested");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const { mutate: updateRequestStatus } = usePatch(
    `${API_ROUTES.updateAdminRequestStatus}/${selectedRequestId}`,
    {
      onSuccess: () => {
        toast.success("Status updated successfully");
        queryClient.invalidateQueries({
          querykey: [`adminRequest-${activeTab}`],
        });
      },
      onError: () => {
        toast.error("Failed to update status");
      },
    },
  );
  const labelMap = {
    requested: "Requested",
    full_filled: "Full Filled",
    inquiry: "Inquiry",
    not_interested: "Not Interested",
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Owner Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Mobile Number" },
      { accessorKey: "city", header: "City" },
      { accessorKey: "message", header: "Request Message" },
      {
        id: "status",
        header: "Status",
        Cell: ({ row }) => {
          const status = row.original.status;

          const colorMap = {
            requested: "warning",
            full_filled: "success",
            inquiry: "info",
            not_interested: "error",
          };
          return (
            <CommonChip
              label={labelMap[status] || status}
              color={colorMap[status] || "default"}
            />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Requested On",
        Cell: ({ row }) =>
          dayjs(row.original.createdAt).format("DD MMM YYYY, hh:mm A"),
      },
    ],
    [],
  );

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
  };

  const handleStatusChange = (row, status) => {
    setSelectedRequestId(row.original._id);

    updateRequestStatus({
      status,
    });
  };

  const actions = [
    {
      label: "Full Filled",
      onClick: (row) => handleStatusChange(row, "full_filled"),
      hidden: (row) => row.original.status === "full_filled",
    },
    {
      label: "Inquiry",
      onClick: (row) => handleStatusChange(row, "inquiry"),
      hidden: (row) => row.original.status === "inquiry",
    },
    {
      label: "Not Interested",
      onClick: (row) => handleStatusChange(row, "not_interested"),
      hidden: (row) => row.original.status === "not_interested",
    },
  ];

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m={3}
      >
        <Typography variant="h5" fontWeight={700} mb={0}>
          Admin Request
        </Typography>
      </Box>
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>
        <TableComponent
          slug="adminRequest"
          columns={columns}
          actions={activeTab === "full_filled" ? [] : actions}
          actionsType="menu"
          querykey={`adminRequest-${activeTab}`}
          getApiEndPoint="adminRequest"
          params={{ status: activeTab }}
          enableExportTable={true}
        />
      </Box>
    </div>
  );
};
