import { Box, Typography, Tabs, Tab, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import { API_ROUTES } from "../../utils/api_constants";
import { usePatch } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { queryClient } from "../../lib/queryClient";
import dayjs from "dayjs";

const STATUS_TABS = [
    { label: "Requested", value: "requested" },
    { label: "Full Filled", value: "full filled" },
    { label: "Inquiry", value: "inquiry" },
    { label: "Not Interested", value: "not interested" },
];

const AdminRequest = () => {
    const [activeTab, setActiveTab] = useState("requested");

    // ✅ Update Status API
    const { mutate: updateRequestStatus } = usePatch(
        API_ROUTES.updateAdminRequestStatus,
        {
            onSuccess: () => {
                toast.success("Status updated successfully");

                // 🔥 refetch ALL adminRequest queries
                queryClient.invalidateQueries({
                    queryKey: ["adminRequest"],
                });
            },
            onError: () => {
                toast.error("Failed to update status");
            },
        }
    );


    // ✅ Table Columns
    const columns = useMemo(() => [
        { accessorKey: "name", header: "Owner Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Mobile Number" },
        { accessorKey: "city", header: "City" },
        { accessorKey: "message", header: "Request Message" },
        {
            id: "status",
            header: "Status",
            Cell: ({ row }) => {
                const status = row.original.status?.toLowerCase();

                const colorMap = {
                    requested: "warning",
                    "full filled": "success",
                    inquiry: "info",
                    "not interested": "error",
                };

                return (
                    <Chip
                        label={row.original.status}
                        color={colorMap[status] || "default"}
                        size="small"
                    />
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Requested On",
            Cell: ({ row }) =>
                dayjs(row.original.createdAt).format(
                    "DD MMM YYYY, hh:mm A"
                ),
        },
    ], []);

    // ✅ Change Status Handler
    const handleStatusChange = (row, status) => {
        updateRequestStatus({
            id: row.original._id,   // send id
            status,                 // send status
        });
    };
    // ✅ Action Menu
    const actions = [
        {
            label: "Requested",
            onClick: (row) => handleStatusChange(row, "requested"),
            hidden: (row) =>
                row.original.status?.toLowerCase() === "requested",
        },
        {
            label: "Full Filled",
            onClick: (row) => handleStatusChange(row, "full filled"),
            hidden: (row) =>
                row.original.status?.toLowerCase() === "full filled",
        },
        {
            label: "Inquiry",
            onClick: (row) => handleStatusChange(row, "inquiry"),
            hidden: (row) =>
                row.original.status?.toLowerCase() === "inquiry",
        },
        {
            label: "Not Interested",
            onClick: (row) =>
                handleStatusChange(row, "not interested"),
            hidden: (row) =>
                row.original.status?.toLowerCase() ===
                "not interested",
        },
    ];

    return (
        <div>
            <Typography variant="h5" fontWeight={700} mb={2}>
                Admin Request
            </Typography>

            {/* ✅ Status Tabs */}
            <Box sx={{ mb: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, value) => setActiveTab(value)}
                >
                    <Tab label="Requested" value="requested" />
                    <Tab label="Full Filled" value="full filled" />
                    <Tab label="Inquiry" value="inquiry" />
                    <Tab label="Not Interested" value="not interested" />
                </Tabs>

            </Box>

            {/* ✅ Table */}
            <TableComponent
                slug="adminRequest"
                columns={columns}
                actions={actions}
                actionsType="menu"
                queryKey={["adminRequest", activeTab]}
                getApiEndPoint="adminRequest"  // ✅ FIXED
                queryParams={{ search: activeTab }}
            // enableExportTable={true}
            />
        </div>
    );
};

export default AdminRequest;

















// import { Box, Button, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { Edit, Trash2, Plus } from "lucide-react";
// import { useMemo, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import TableComponent from "../../components/TableComponent/TableComponent";
// import { API_ROUTES } from "../../utils/api_constants";
// import { usePatch, usePost } from "../../utils/hooks/api_hooks";
// import toast from "react-hot-toast";
// import { queryClient } from "../../lib/queryClient";
// import { Chip } from "@mui/material";
// import dayjs from "dayjs";
// // import { useQuery } from "@tanstack/react-query";
// import { Tabs, Tab } from "@mui/material";
// const AdminRequest = () => {


//     // const navigate = useNavigate();
//     // const { isSuperAdmin } = useAuth();


//     // const [selectedRequestId, setSelectedRequestId] = useState(null);
//     const [activeTab, setActiveTab] = useState("requested");
//     // Requested | Accepted | Rejected
//     // <Box sx={{ px: 3, mb: 2 }}>
//     //     <Tabs
//     //         value={activeTab}
//     //         onChange={(_, value) => setActiveTab(value)}
//     //         textColor="primary"
//     //         indicatorColor="primary"
//     //         sx={{
//     //             "& .MuiTab-root": {
//     //                 fontWeight: 600,
//     //                 textTransform: "none",
//     //             },
//     //         }}
//     //     >
//     //         <Tab label="Requested" value="requested" />
//     //         <Tab label="Accepted" value="accepted" />
//     //         <Tab label="Rejected" value="rejected" />
//     //     </Tabs>
//     // </Box>

//     // <Box sx={{ px: 3, mb: 2 }}>
//     //     <Tabs
//     //         value={activeTab}
//     //         // onChange={(_, value) => setActiveTab(value)}
//     //         // textColor="primary"
//     //         // indicatorColor="primary"
//     //         onChange={(e, newValue) => setActiveTab(newValue)}
//     //     >
//     //         <Tab label="Requested" value="Requested" />
//     //         <Tab label="Full Filled" value="Full Filled" />
//     //         <Tab label="Inquiry" value="Inquiry" />
//     //         <Tab label="Not Interested" value="Not Interested" />
//     //     </Tabs>
//     // </Box>

//     const { mutate: updateRequestStatus } = usePatch(
//         API_ROUTES.updateAdminRequestStatus,
//         {
//             onSuccess: () => {
//                 toast.success("Status updated successfully");
//                 queryClient.invalidateQueries({ queryKey: ["adminRequest"] });
//             },
//             onError: () => {
//                 toast.error("Failed to update status");
//             },
//         }
//     );
//     const columns = useMemo(
//         () => [
//             {
//                 accessorKey: "name",
//                 header: "Owner Name",
//             },
//             {
//                 accessorKey: "email",
//                 header: "Email",
//             },
//             {
//                 accessorKey: "phone",
//                 header: "Mobile Number",
//             },
//             {
//                 accessorKey: "city",
//                 header: "City",
//             },
//             {
//                 accessorKey: "message",
//                 header: "Request Message",
//             },
//             {
//                 id: "status",
//                 header: "Status",
//                 Cell: ({ row }) => {
//                     const status = row.original.status;

//                     const colorMap = {
//                         "Requested": "warning",
//                         "Full Filled": "success",
//                         "Inquiry": "info",
//                         "Not Interested": "error",
//                     };

//                     return (
//                         <Chip
//                             label={status}
//                             color={colorMap[status] || "default"}
//                             size="small"
//                         />
//                     );
//                 },
//             },
//             // {
//             //     accessorKey: "createdAt",
//             //     header: "Requested On",
//             // },
//             {
//                 accessorKey: "createdAt",
//                 header: "Requested On",
//                 Cell: ({ row }) => {
//                     return dayjs(row.original.createdAt).format(
//                         "DD MMM YYYY, hh:mm A"
//                     );
//                 },
//             },

//         ],
//         []
//     );

//     const handleStatusChange = (row, status) => {
//         updateRequestStatus(
//             {
//                 id: row.original._id,
//                 data: { status },
//             },
//             {
//                 onSuccess: () => {
//                     toast.success("Status updated successfully");
//                     queryClient.invalidateQueries({
//                         queryKey: ["adminRequest"],
//                     });
//                 },
//                 onError: () => {
//                     toast.error("Failed to update status");
//                 },
//             }
//         );
//     };
//     const actions = [
//         {
//             label: "Requested",
//             onClick: (row) => handleStatusChange(row, "requested"),
//             hidden: (row) => row.original.status === "requested",
//         },
//         {
//             label: "Full Filled",
//             onClick: (row) => handleStatusChange(row, "Full Filled"),
//             hidden: (row) => row.original.status === "Full Filled",
//         },
//         {
//             label: "Inquiry",
//             onClick: (row) => handleStatusChange(row, "Inquiry"),
//             hidden: (row) => row.original.status === "Inquiry",
//         },
//         {
//             label: "Not Interested",
//             onClick: (row) => handleStatusChange(row, "Not Interested"),
//             hidden: (row) => row.original.status === "Not Interested",
//         },
//     ];

//     return (
//         <div>
//             <Typography variant="h5" fontWeight={700}>
//                 Admin Request
//             </Typography>

//             <Box sx={{ px: 3, mb: 2 }}>
//                 <Tabs
//                     value={activeTab} onChange={(e, val) => setActiveTab(val)}
//                 // onChange={(_, value) => setActiveTab(value)}
//                 // textColor="primary"
//                 // indicatorColor="primary"
//                 >
//                     <Tabs
//                         value={activeTab}
//                         onChange={(e, val) => setActiveTab(val)}
//                     >
//                         <Tab label="Requested" value="requested" />
//                         <Tab label="Full Filled" value="full_filled" />
//                         <Tab label="Inquiry" value="inquiry" />
//                         <Tab label="Not Interested" value="not_interested" />
//                     </Tabs>
//                 </Tabs>
//             </Box>

//             <TableComponent
//                 slug="adminRequest"
//                 columns={columns}
//                 actions={actions}
//                 actionsType="menu"
//                 querykey={`adminRequest-${activeTab}`}
//                 getApiEndPoint="adminRequest"
//                 queryParams={{ status: activeTab }}
//                 enableExportTable={true}
//             />
//         </div>
//     );
// };

// export default AdminRequest;


// import { Box, Button, Typography, Tabs, Tab, Chip } from "@mui/material";
// import { useMemo, useState } from "react";
// import TableComponent from "../../components/TableComponent/TableComponent";
// import { API_ROUTES } from "../../utils/api_constants";
// import { usePatch } from "../../utils/hooks/api_hooks";
// import toast from "react-hot-toast";
// import { queryClient } from "../../lib/queryClient";
// import dayjs from "dayjs";

// const STATUS_TABS = [
//     { label: "Requested", value: "requested" },
//     { label: "Full Filled", value: "full filled" },
//     { label: "Inquiry", value: "inquiry" },
//     { label: "Not Interested", value: "not interested" },
// ];
// const AdminRequest = () => {
//     // const [activeTab, setActiveTab] = useState("Requested");
//     const [activeTab, setActiveTab] = useState("requested");

//     const { mutate: updateRequestStatus } = usePatch(
//         API_ROUTES.updateAdminRequestStatus,
//         {
//             onSuccess: () => {
//                 toast.success("Status updated successfully");
//                 queryClient.invalidateQueries({
//                     queryKey: [`adminRequest-${activeTab}`],
//                     exact: false,
//                 });
//             },
//             onError: () => {
//                 toast.error("Failed to update status");
//             },
//         }
//     );

//     const columns = useMemo(() => [
//         { accessorKey: "name", header: "Owner Name" },
//         { accessorKey: "email", header: "Email" },
//         { accessorKey: "phone", header: "Mobile Number" },
//         { accessorKey: "city", header: "City" },
//         { accessorKey: "message", header: "Request Message" },
//         {
//             id: "status",
//             header: "Status",
//             Cell: ({ row }) => {
//                 const status = row.original.status;
//                 // const colorMap = {
//                 //     "Requested": "warning",
//                 //     "Full Filled": "success",
//                 //     "Inquiry": "info",
//                 //     "Not Interested": "error",
//                 // };
//                 const colorMap = {
//                     requested: "warning",
//                     "full filled": "success",
//                     inquiry: "info",
//                     "not interested": "error",
//                 };
//                 const normalizedStatus = status?.toLowerCase();
//                 return (
//                     <Chip
//                         label={status}
//                         color={colorMap[normalizedStatus] || "default"}
//                         size="small"
//                     />
//                 );
//             },
//         },
//         {
//             accessorKey: "createdAt",
//             header: "Requested On",
//             Cell: ({ row }) => dayjs(row.original.createdAt).format("DD MMM YYYY, hh:mm A"),
//         },
//     ], []);
//     const handleStatusChange = (row, status) => {
//         updateRequestStatus({
//             id: row.original._id,
//             data: { status: status.toLowerCase() },
//         });
//     };

//     const actions = [
//         {
//             label: "Requested",
//             onClick: (row) => handleStatusChange(row, "requested"),
//             hidden: (row) => row.original.status?.toLowerCase() === "requested",
//         },
//         {
//             label: "Full Filled",
//             onClick: (row) => handleStatusChange(row, "full filled"),
//             hidden: (row) => row.original.status?.toLowerCase() === "full filled",
//         },
//         {
//             label: "Inquiry",
//             onClick: (row) => handleStatusChange(row, "inquiry"),
//             hidden: (row) => row.original.status?.toLowerCase() === "inquiry",
//         },
//         {
//             label: "Not Interested",
//             onClick: (row) => handleStatusChange(row, "not interested"),
//             hidden: (row) => row.original.status?.toLowerCase() === "not interested",
//         },
//     ];

//     const queryParams = status ? { status: activeTab } : {};

//     return (
//         <div>
//             <Typography variant="h5" fontWeight={700}>
//                 Admin Request
//             </Typography>

//             <Box sx={{ px: 3, mb: 2 }}>
//                 {/* <Tabs
//                     value={activeTab}
//                     onChange={(e, val) => setActiveTab(val)}
//                     textColor="primary"
//                     indicatorColor="primary"
//                     sx={{ "& .MuiTab-root": { fontWeight: 600, textTransform: "none" } }}
//                 >
//                     <Tab label="Requested" value="Requested" />
//                     <Tab label="Full Filled" value="Full Filled" />
//                     <Tab label="Inquiry" value="Inquiry" />
//                     <Tab label="Not Interested" value="Not Interested" />
//                 </Tabs> */}

//                 <Tabs
//                     value={activeTab}
//                     onChange={(e, value) => setActiveTab(value)}
//                 >
//                     {STATUS_TABS.map((tab) => (
//                         <Tab
//                             key={tab.value}
//                             label={tab.label}
//                             value={tab.value}
//                         />
//                     ))}
//                 </Tabs>
//             </Box>
//             {console.log("Active Tab:", activeTab)}
//             <TableComponent
//                 slug="adminRequest"
//                 columns={columns}
//                 actions={actions}
//                 actionsType="menu"
//                 queryKey={[`adminRequest-${activeTab}`]}  // VERY IMPORTANT
//                 getApiEndPoint="adminRequest"
//                 queryParams={{ status: activeTab }}     // IMPORTANT
//                 enableExportTable={true}
//             />
//         </div>
//     );
// };

// export default AdminRequest;