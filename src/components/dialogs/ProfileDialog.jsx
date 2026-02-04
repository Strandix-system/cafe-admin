import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";

import ProfileForm from "../forms/ProfileForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProfileDialog({ open, onClose }) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "#6f4e37", // brown
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>

          <Typography sx={{ ml: 2, flex: 1, color: "#fff" }} variant="h6">
            Profile
          </Typography>

          <Button
            sx={{
              color: "#fff",
              borderColor: "#fff",
            }}
            type="submit"
            form="profile-form"
          >
            Edit Profile
          </Button>
        </Toolbar>
      </AppBar>

      <ProfileForm onClose={onClose} />
    </Dialog>
  );
}


