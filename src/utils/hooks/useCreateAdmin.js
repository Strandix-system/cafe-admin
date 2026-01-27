import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdmin } from "../../services/aminService";

// export const useCreateAdmin = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createAdmin,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["admins"]);
//     },
//   });
// };

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin"]);
      alert("Admin added successfully");
    },
    onError: (error) => {
      console.error(error);
      alert("Failed to add admin");
    },
  });
};

