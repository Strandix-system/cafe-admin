import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Dialog,
  Tabs,
  Tab,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import BasicInfoForm from "./BasicInfoForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ProfileDialog({ open, onClose }) {
  const [tab, setTab] = useState(0);

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      {/* HEADER */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>

          <Typography sx={{ flex: 1 }} variant="h6">
            Profile
          </Typography>

          <Button color="inherit">EDIT PROFILE</Button>
        </Toolbar>
      </AppBar>

      {/* TABS */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Basic Info" />
        <Tab label="Reset Password" />
      </Tabs>

      {/* CONTENT */}
      <Box p={4}>
        {tab === 0 && <BasicInfoForm />}
        {tab === 1 && <ResetPasswordForm />}
      </Box>
    </Dialog>
  );
}
