import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import FormComponent from "../../components/forms/formComponent";

export default function CreateAdmin() {
  const navigate = useNavigate();

  const { mutate, isPending } = usePost(API_ROUTES.createAdmins, {
    onSuccess: () => {
      toast.success("Admin created successfully");
      navigate("/users/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create admin");
    },
  });

  const handleCreate = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    mutate(formData);
  };

  return (
    <div className="bg-white">
    <FormComponent
      defaultValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          cafeName: "",
          phoneNumber: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          logo: null,
          profileImage: null,
        }}
        onSubmit={handleCreate}
        isEdit={false}
      isLoading={isPending}
      />
      </div>
  );
}
