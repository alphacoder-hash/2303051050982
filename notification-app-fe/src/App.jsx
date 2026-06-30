import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';
import { useEffect } from 'react';
import { Log } from 'logging-middleware';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        background: {
            default: '#f5f5f5'
        }
    },
});

function App() {
    useEffect(() => {
        Log("frontend", "info", "component", "App initialized and loaded");
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<AllNotifications />} />
                        <Route path="priority" element={<PriorityInbox />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;