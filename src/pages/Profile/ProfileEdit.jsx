import { Button, Tabs, Tab ,Avatar,
  IconButton,} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileBasicForm from "./ProfileBasicForm";
import ResetPasswordForm from "./ResetPasswordForm";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function ProfileEdit({ user }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");


  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  setProfileImage(previewUrl);

  // later: send file to backend
};
  return (
    <>
      <div className="flex justify-between items-center px-6 py-4">
        <div /> {/* empty left space */}
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      {/* Header */}
      {/* Profile Image Section */}
<div className="px-6 flex items-center gap-4">
  <div className="relative">
    <Avatar
      src={profileImage}
      sx={{
        width: 96,
        height: 96,
        bgcolor: "#9e8b86",
      }}
    />

    {/* Camera Icon */}
    <IconButton
      component="label"
      sx={{
        position: "absolute",
        bottom: 0,
        right: 0,
        bgcolor: "#fff",
        boxShadow: 1,
        "&:hover": { bgcolor: "#f5f5f5" },
      }}
    >
      <PhotoCameraIcon fontSize="small" />
      <input
        hidden
        accept="image/*"
        type="file"
        onChange={handleImageChange}
      />
    </IconButton>
  </div>
</div>


      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} className="px-6">
        <Tab label="Basic Info" />
        <Tab label="Reset Password" />
      </Tabs>

      {/* Tab content */}
      <div className="px-6 mt-4">
        {tab === 0 && <ProfileBasicForm defaultValues={user} />}
        {tab === 1 && <ResetPasswordForm />}
      </div>
    </>
  );
}
