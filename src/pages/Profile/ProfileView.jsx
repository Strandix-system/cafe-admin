import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProfileView({ user }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        {/* Back button (LEFT) */}
        <Button variant="outlined" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        {/* Edit button (RIGHT) */}
        <Button
          variant="contained"
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">General Information</h2>

        <p><b>First Name:</b> {user.firstName}</p>
        <p><b>Last Name:</b> {user.lastName}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phoneNumber}</p>
      </div>
    </>
  );
}
