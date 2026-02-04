import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SIDEBAR_WIDTH = 320;
const settings = ["Profile", "Logout"];

export default function TopNavbar({ onProfileClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);

    if (setting === "Profile") onProfileClick();
    if (setting === "Logout") {
      logout();
      navigate("/");
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#6F4E37",
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
            <Avatar />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={() => setAnchorElUser(null)}
        >
          {settings.map((setting) => (
            <MenuItem
              key={setting}
              onClick={() => handleCloseUserMenu(setting)}
            >
              {setting}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
