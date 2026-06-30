import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/Inbox';
import { Log } from 'logging-middleware';
import { useEffect } from 'react';

export default function Layout() {
    const location = useLocation();

    useEffect(() => {
        Log("frontend", "info", "page", `Navigated to ${location.pathname}`);
    }, [location]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <NotificationsIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Campus Notifications
                    </Typography>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/"
                        startIcon={<NotificationsIcon />}
                        sx={{ 
                            mx: 1,
                            borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
                            borderRadius: 0
                        }}
                    >
                        All Notifications
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/priority"
                        startIcon={<InboxIcon />}
                        sx={{ 
                            mx: 1,
                            borderBottom: location.pathname === '/priority' ? '2px solid white' : 'none',
                            borderRadius: 0
                        }}
                    >
                        Priority Inbox
                    </Button>
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ flex: 1, py: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
}
