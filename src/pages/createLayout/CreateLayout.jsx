import LayoutForm from "../../components/layout/LayoutForm";
import { queryClient } from "../../lib/queryClient";
import { API_ROUTES } from "../../utils/api_constants";
import { usePost } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateLayout() {
  const navigate = useNavigate();

  const { mutate: createLayout, isPending } = usePost(
    API_ROUTES.createLayout,
    {
      onSuccess: () => {
        toast.success("Layout created successfully");
        queryClient.invalidateQueries({ queryKey: ["getLayouts"] }); 
        navigate("/layouts");
      },
      onError: (err) =>
        toast.error(err?.message || "Failed to create layout"),
    }
  );

  const handleCreate = (formData) => {
    createLayout(formData);
  };

  return (
    <LayoutForm
      defaultValues={{
        layoutTitle: "",
        homeImage: null,
        menuTitle: "",
        aboutImage: null,
        aboutTitle: "",
        aboutDescription: "",
        cafeDescription: "",
      }}
      onSubmit={handleCreate}
      isEdit={false}
      isLoading={isPending}
    />
  );
}
