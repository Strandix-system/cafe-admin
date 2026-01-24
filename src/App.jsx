import { useState } from 'react'
import Login from './pages/Login'
import AppRoutes from './routes/AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from "@emotion/cache";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from 'react-router-dom';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const emotionCacheOptions = {
  rtl: {
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
  ltr: {
    key: "muiltr",
    stylisPlugins: [],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
};

function App() {
  return (
    <>
      <CacheProvider value={createCache(emotionCacheOptions.ltr)}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes>
                <Login />
              </AppRoutes>
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </CacheProvider>
    </>
  )
}

export default App
