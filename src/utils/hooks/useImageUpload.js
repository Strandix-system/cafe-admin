import { useState, useCallback } from "react";

export const useImageUpload = (setValue) => {
  const [previews, setPreviews] = useState({});

  const handleImageChange = useCallback(
    (file, fieldName) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => ({
            ...prev,
            [fieldName]: reader.result,
          }));
          setValue(fieldName, file);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue],
  );

  const handleRemoveImage = useCallback((fieldName, fieldOnChange) => {
    setPreviews((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    fieldOnChange(null);
  }, []);

  const setPreview = useCallback((fieldName, preview) => {
    setPreviews((prev) => ({
      ...prev,
      [fieldName]: preview,
    }));
  }, []);

  return {
    previews,
    handleImageChange,
    handleRemoveImage,
    setPreview,
  };
};
