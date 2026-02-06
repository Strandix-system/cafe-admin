import { Card, CardContent, Typography, Button, MenuItem, Menu } from "@mui/material";
import RowActionMenu from "../common/RowActionMenu";
import { Edit, Trash, Eye, EllipsisVertical } from "lucide-react";
import { useState } from "react";


const LayoutCard = ({ layout, onDelete, deleting, onEdit }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const layoutActions = [
    {
      label: "Edit",
      icon: Edit,
      color: "#1976d2",
      onClick: () => onEdit(layout),
    },
    {
      label: "Delete",
      icon: Trash,
      color: "#f00",
      onClick: () => onDelete(layout),
      isDisabled: () => deleting,
    },
  ];

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group p-5 ml-7">

      {/* IMAGE SECTION */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={layout.homeImage || "https://via.placeholder.com/400x200?text=No+Image"}
          alt={layout.layoutTitle}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Preview Button (Only visible on hover) */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="contained"
            startIcon={<Eye size={18} />}
            sx={{ backgroundColor: "#fff", color: "#000" }}
            onClick={() => window.open(layout.previewUrl || "#", "_blank")}
          >
            Preview
          </Button>
        </div>

        {/* Action Menu (Top Right) */}
        {/* <div className="absolute top-2 right-2">
          <RowActionMenu
            actions={layoutActions}
            row={{ original: layout }}
            actionsType="menu"
          />
        </div>
        */}
      </div>


      <div className="flex justify-center items-center">
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{
            outline: "none",
            boxShadow: "none",
            "&:focus": {

              outline: "none",
              boxShadow: "none",
            }
          }}
        >
          <EllipsisVertical />
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={onEdit(layout)}>Edit</MenuItem>
          <MenuItem onClick={onDelete(layout)}>Delete</MenuItem>
        </Menu>

      {/* CONTENT */}
      <CardContent className="bg-white">
        <Typography variant="h6" fontWeight={700}>
          {layout.layoutTitle || "Untitled Layout"}
        </Typography>

      </CardContent>
      </div>
    </Card>
  );
};

export default LayoutCard;
