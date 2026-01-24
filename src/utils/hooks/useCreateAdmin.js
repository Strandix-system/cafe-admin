import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdmin } from "../services/admin.service";

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
    },
  });
};
