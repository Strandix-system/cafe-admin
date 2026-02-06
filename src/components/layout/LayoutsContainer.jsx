// import { Grid, Box, CircularProgress } from "@mui/material";
// import LayoutCard from "./LayoutCard";
// import { useFetch, useDelete } from "../../utils/hooks/api_hooks";
// import { API_ROUTES } from "../../utils/api_constants";
// import { queryClient } from "../../lib/queryClient";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";   // ✅ ADD THIS

// const LayoutsContainer = () => {
//   const navigate = useNavigate();   // ✅ ADD THIS

//   // --------- FETCH LAYOUTS ----------
//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//   } = useFetch("get-layouts", API_ROUTES.getLayouts);

//   // --------- DELETE LAYOUT LOGIC ----------
//   const { mutate: deleteLayout, isPending: isDeleting } = useDelete(
//     API_ROUTES.deleteLayout,
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["get-layouts"] });
//         toast.success("Layout deleted successfully");
//       },
//       onError: (err) => {
//         toast.error(err || "Something went wrong");
//       },
//     }
//   );

//   const handleDelete = (layout) => {
//     deleteLayout(layout._id);
//   };

//   if (isLoading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={5}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isError) {
//     return <div>Error: {error}</div>;
//   }

//   const layouts = data?.result?.results || [];

//   return (
//     <Grid container spacing={3}>
//       {layouts.map((layout) => (
//         <Grid item xs={12} sm={6} md={4} key={layout._id}>
//           <LayoutCard
//             layout={layout}
//             onEdit={() => navigate(`/layouts/edit/${layout._id}`)}  // ✅ KEY LINE
//             onDelete={() => handleDelete(layout)}
//             deleting={isDeleting}
//           />
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default LayoutsContainer;
