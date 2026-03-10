import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin App Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
          <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
            {/* Icon */}
            <div className="text-5xl mb-4">⚠️</div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Something went wrong
            </h1>

            {/* Message */}
            <p className="text-gray-500 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
