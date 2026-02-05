import {
  FallingLines,
  FidgetSpinner,
  Hourglass,
  Oval,
  TailSpin,
  ThreeDots,
} from "react-loader-spinner";

export default function Loader({
  variant = "oval",
  size = 25,
  color = "#3d55e0",
}) {
  // Fullscreen loader
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={["#306cce", "#72a1ed"]}
        />
      </div>
    );
  }

  switch (variant) {
    case "spinner":
      return (
        <TailSpin
          height={size}
          width={size}
          color={color}
          visible
          ariaLabel="spinner-loading"
        />
      );

    case "dots":
      return (
        <ThreeDots
          height={size}
          width={size}
          color={color}
          visible
          ariaLabel="dots-loading"
        />
      );
    case "fallingLines":
      return (
        <FallingLines
          height={size}
          width={size}
          color={color}
          visible={true}
          ariaLabel="falling-circles-loading"
        />
      );
    case "fidget":
      return (
        <FidgetSpinner
          visible={true}
          height="30"
          ariaLabel="fidget-spinner-loading"
          wrapperStyle={{}}
          wrapperClass="fidget-spinner-wrapper"
          backgroundColor={color}
        />
      );

    default:
      return (
        <Oval
          height={size}
          width={size}
          color={color}
          secondaryColor={color}
          strokeWidth={2}
          strokeWidthSecondary={2}
          visible
          ariaLabel="oval-loading"
        />
      );
  }
}
