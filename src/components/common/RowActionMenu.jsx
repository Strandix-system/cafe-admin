import { IconButton, MenuItem, Tooltip } from "@mui/material";

const RowActionMenu = ({
  actions = [],
  row,
  actionsType = "icons",
  closeMenu,
}) => {
  return actions.map((action, i) => {
    const isDisabled = action?.isDisabled
      ? action?.isDisabled(row)
      : false;

    return actionsType === "icons" ? (
      <Tooltip
        title={action?.label}
        key={`action-${action?.label}-${i}`}
      >
        <IconButton
          onClick={() => {
            setTimeout(() => action?.onClick(row));
          }}
          disabled={isDisabled}
        >
          {action?.icon && (
            <action.icon
              size={22}
              color={isDisabled ? undefined : action?.color}
            />
          )}
        </IconButton>
      </Tooltip>
    ) : (
      <MenuItem
        key={`action-${action?.label}-${i}`}
        onClick={() => {
          closeMenu?.();
          setTimeout(() => action?.onClick(row));
        }}
        disabled={isDisabled}
      >
        {action?.icon && (
          <action.icon
            size={18}
            className="mr-8"
            color={isDisabled ? undefined : action?.color}
          />
        )}
        {action?.label}
      </MenuItem>
    );
  });
};

export default RowActionMenu;
