import { useState, useMemo } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCard from '../components/NotificationCard';
import { MinHeap } from '../utils/priority';
import { Log } from 'logging-middleware';

export default function PriorityInbox() {
    const [n, setN] = useState(10);
    // Fetch a larger chunk of notifications to find the top N priorities from them
    const { notifications, loading, error } = useNotifications(1, 100, '');

    const handleNChange = async (e) => {
        const newN = e.target.value;
        setN(newN);
        await Log("frontend", "info", "page", `User changed top N filter to ${newN}`);
    };

    const topNotifications = useMemo(() => {
        if (!notifications || notifications.length === 0) return [];
        const heap = new MinHeap(n);
        for (const notif of notifications) {
            heap.push(notif);
        }
        return heap.getSorted();
    }, [notifications, n]);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Priority Inbox
                </Typography>
                
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="n-filter-label">Top 'n'</InputLabel>
                    <Select
                        labelId="n-filter-label"
                        value={n}
                        label="Top 'n'"
                        onChange={handleNChange}
                    >
                        <MenuItem value={5}>Top 5</MenuItem>
                        <MenuItem value={10}>Top 10</MenuItem>
                        <MenuItem value={15}>Top 15</MenuItem>
                        <MenuItem value={20}>Top 20</MenuItem>
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
            ) : topNotifications.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center" py={4}>
                    No priority notifications found.
                </Typography>
            ) : (
                <Box>
                    {topNotifications.map(notif => (
                        <NotificationCard key={notif.ID} notification={notif} />
                    ))}
                </Box>
            )}
        </Box>
    );
}
