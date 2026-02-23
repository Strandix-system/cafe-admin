import { useState } from 'react'
import Login from './pages/Login'
import AppRoutes from './routes/AppRoutes'
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from "@emotion/cache";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { ThemeModeProvider } from "./context/ThemeContext";
import "./index.css"
// import { ThemeModeProvider } from './context/ThemeContext';

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
                    {/* <ThemeModeProvider> */}
                    <AuthProvider>
                        <AppRoutes />
                        <Toaster position="top-right" reverseOrder={false} />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </AuthProvider>
                    {/* </ThemeModeProvider> */}
                </QueryClientProvider>
            </CacheProvider>
        </>
    )
}

export default App
