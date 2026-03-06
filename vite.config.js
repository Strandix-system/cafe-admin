import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // 👈 IMPORTANT for Amplify
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist", // 👈 Ensure output folder
  },
});
