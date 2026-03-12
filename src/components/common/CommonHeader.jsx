import { CommonButton } from "./commonButton";

export const CommonHeader = ({
  title,
  buttonText,
  onButtonClick,
  buttonIcon,
  buttonVariant = "contained",
  buttonDisabled = false,
  titleClass = "text-2xl font-bold text-gray-800",
}) => {
  return (
    <div className="flex items-center justify-between p-6">
      <h2 className={titleClass}>{title}</h2>

      {buttonText && (
        <CommonButton
          variant={buttonVariant}
          startIcon={buttonIcon}
          onClick={onButtonClick}
          disabled={buttonDisabled}
        >
          {buttonText}
        </CommonButton>
      )}
    </div>
  );
};
