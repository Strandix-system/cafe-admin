import { TableComponent } from "../../components/TableComponent/TableComponent";
import { Box, Typography, Rating } from "@mui/material";
import { useMemo, useState } from "react";
import { usePatch } from "../../utils/hooks/api_hooks";
import { queryClient } from "../../lib/queryClient";
import { Eye, Star } from "lucide-react";
import toast from "react-hot-toast";
import { API_ROUTES } from "../../utils/api_constants";

export const FeedbackList = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Customer Name",
        Cell: ({ row }) => row?.original?.customerId?.name || "-",
      },
      {
        accessorKey: "rate",
        header: "Rating",
        Cell: ({ row }) => (
          <Rating
            value={Number(row.original.rate) || 0}
            readOnly
            size="small"
          />
        ),
      },
      {
        accessorKey: "description",
        header: "Feedback",
      },
    ],
    [],
  );
  // throw new Error("Test error boundary");
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  const { mutate: selectFeedback } = usePatch(
    selectedFeedbackId
      ? `${API_ROUTES.selectFeedback}/${selectedFeedbackId}`
      : null,
    {
      onSuccess: () => {
        toast.success("Feedback added to portfolio");
        queryClient.invalidateQueries({ queryKey: ["feedback-list"] });
      },
      // onError: (error) => toast.error(error?.message || "Failed"),
      onError: (error) => {
        toast.error(error || "Failed");
      },
    },
  );

  const handleSelectFeedback = (row) => {
    const feedbackId = row.original._id;

    setSelectedFeedbackId(feedbackId);
    selectFeedback({});
  };

  const actions = [
    {
      label: "Add to Portfolio",
      icon: Star,
      onClick: handleSelectFeedback,
    },
  ];

  return (
    <div className="overflow-hidden">
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="#6F4E37">
          Customer Feedbacks
        </Typography>
      </Box>

      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>
        <TableComponent
          slug="feedback"
          columns={columns}
          actions={actions}
          actionsType="menu"
          querykey="feedback-list"
          getApiEndPoint="getFeedback"
          deleteApiEndPoint="deleteFeedback"
          deleteAction={true}
          enableExportTable={true}
        />
      </Box>
    </div>
  );
};
