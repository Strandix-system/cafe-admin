import LayoutForm from "../../components/layout/LayoutForm";
import { queryClient } from "../../lib/queryClient";
import { API_ROUTES } from "../../utils/api_constants";
import { useFetch, usePatch } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function EditLayout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useFetch(
    ["layout", id],
    API_ROUTES.getLayoutById(id)
  );

  const { mutate: updateLayout, isPending } = usePatch(
    API_ROUTES.updateLayout(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: "getLayouts" }); 
        toast.success("Layout updated successfully");
        navigate("/layouts");
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to update layout");
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <LayoutForm
      defaultValues={data?.result}
      onSubmit={updateLayout}
      isEdit
      isLoading={isPending}
    />
  );
}
