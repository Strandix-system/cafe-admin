import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import FormComponent from "../../components/forms/FormComponent";
import { useFetch, usePatch, usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";

export default function AddEditAdmin() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useFetch(
    `user-${userId}`,
    `${API_ROUTES.getUserById}/${userId}`,
    {},
    {
      enabled: !!userId,
    },
  );

  const { mutate: updateMutate, isPending: updatePending } = usePatch(
    `${API_ROUTES.updateUsers}/${userId}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("get-users");
        toast.success("User updated successfully");
        navigate("/users");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  const { mutate: createMutate, isPending: createPending } = usePost(
    API_ROUTES.createAdmins,
    {
      onSuccess: () => {
        toast.success("Admin created successfully");
        navigate("/users");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to create cafe");
      },
    },
  );

  const onSubmit = (data) => {
    if (userId) {
      updateMutate(data);
    } else {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      createMutate(formData);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <FormComponent
      onSubmit={onSubmit}
      isLoading={isLoading}
      isSubmitting={updatePending || createPending}
      {...(data?.result ? { defaultValues: data.result } : {})}
    />
  );
}
