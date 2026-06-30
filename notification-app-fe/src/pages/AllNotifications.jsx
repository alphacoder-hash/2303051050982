import { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Pagination, CircularProgress, Alert } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCard from '../components/NotificationCard';
import { Log } from 'logging-middleware';

export default function AllNotifications() {
    const [page, setPage] = useState(1);
    const [type, setType] = useState('');
    const limit = 10;

    const { notifications, loading, error } = useNotifications(page, limit, type);

    const handleTypeChange = async (e) => {
        const newType = e.target.value;
        setType(newType);
        setPage(1); // Reset to page 1 on filter change
        await Log("frontend", "info", "page", `User filtered notifications by type: ${newType || 'All'}`);
    };

    const handlePageChange = async (event, value) => {
        setPage(value);
        await Log("frontend", "info", "page", `User navigated to page ${value}`);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    All Notifications
                </Typography>
                
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="type-filter-label">Filter by Type</InputLabel>
                    <Select
                        labelId="type-filter-label"
                        value={type}
                        label="Filter by Type"
                        onChange={handleTypeChange}
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        <MenuItem value="Placement">Placement</MenuItem>
                        <MenuItem value="Result">Result</MenuItem>
                        <MenuItem value="Event">Event</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading notifications: {error}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : notifications.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center" py={4}>
                    No notifications found.
                </Typography>
            ) : (
                <Box>
                    {notifications.map(notif => (
                        <NotificationCard key={notif.ID} notification={notif} />
                    ))}
                    
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination 
                            count={10} // Assuming 10 pages for demo since API doesn't return total count
                            page={page} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
