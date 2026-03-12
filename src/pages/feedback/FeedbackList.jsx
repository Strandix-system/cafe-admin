import { TableComponent } from "../../components/TableComponent/TableComponent";
import { Box, Typography, Rating, IconButton, Switch } from "@mui/material";
import { useMemo, useState } from "react";
import { usePatch } from "../../utils/hooks/api_hooks";
import { queryClient } from "../../lib/queryClient";
import { Eye, EyeOff, Star } from "lucide-react";
import toast from "react-hot-toast";
import { API_ROUTES } from "../../utils/api_constants";
import { Chip, Stack } from "@mui/material";
import { CommonHeader } from "../../components/common/CommonHeader";

export const FeedbackList = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Customer Name",
        Cell: ({ row }) => {
          const name = row?.original?.customerId?.name ?? "-";
          const isFeatured = row?.original?.isPortfolioFeatured;

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <span>{name}</span>
              {isFeatured && (
                <CommonChip
                  label="Featured"
                  variant="orange"
                  icon={<Star size={10} />}
                  fontWeight={600}
                  sx={{ "& .MuiChip-icon": { fontSize: "12px", ml: "4px" } }}
                />
              )}
            </Stack>
          );
        },
      },
      {
        accessorKey: "rate",
        header: "Rating",
        Cell: ({ row }) => (
          <Rating
            value={Number(row.original.rate ?? 0)}
            readOnly
            size="small"
          />
        ),
      },
      {
        accessorKey: "description",
        header: "Feedback",
      },
      {
        id: "featuredToggle",
        header: "Featured",
        Cell: ({ row }) => {
          const isFeatured = row.original.isPortfolioFeatured;
          return (
            <Switch
              checked={isFeatured}
              color="warning"
              size="small"
              onChange={() => handleSelectFeedback(row)}
            />
          );
        },
      },
    ],
    [],
  );

  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const { mutate: selectFeedback } = usePatch(
    `${API_ROUTES.selectFeedback}/${selectedFeedbackId}`,
    {
      enabled: !!selectedFeedbackId,
      onSuccess: () => {
        toast.success("Feedback selection updated");
        queryClient.invalidateQueries({ queryKey: ["feedback-list"] });
        setSelectedFeedbackId(null);
      },
      onError: (error) => {
        console.log("error", error);
        toast.error(error || error?.message || "Failed");
      },
    },
  );

  const handleSelectFeedback = (row) => {
    const feedbackId = row.original._id;
    const isSelected = !row.original.isPortfolioFeatured;

    setSelectedFeedbackId(feedbackId);

    selectFeedback({
      isPortfolioFeatured: isSelected,
    });
  };

  return (
    <div className="overflow-hidden">
      <CommonHeader title="Customer Feedbacks" />

      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>
        <TableComponent
          slug="feedback"
          columns={columns}
          querykey="feedback-list"
          getApiEndPoint="getFeedback"
          deleteApiEndPoint="deleteFeedback"
          deleteAction={true}
          enableExportTable={true}
          params={{ sortBy: "isPortfolioFeatured:desc" }}
        />
      </Box>
    </div>
  );
};
