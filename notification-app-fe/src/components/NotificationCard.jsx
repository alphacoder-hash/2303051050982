import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { isRead, markAsRead } from '../utils/readState';
import { useState } from 'react';
import { Log } from 'logging-middleware';

export default function NotificationCard({ notification }) {
    const [read, setRead] = useState(() => isRead(notification.ID));

    const handleClick = async () => {
        if (!read) {
            await markAsRead(notification.ID);
            setRead(true);
            await Log("frontend", "info", "component", `User clicked and read notification ${notification.ID}`);
        } else {
            await Log("frontend", "info", "component", `User clicked already read notification ${notification.ID}`);
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'Placement': return 'success';
            case 'Result': return 'info';
            case 'Event': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Card 
            onClick={handleClick}
            sx={{ 
                mb: 2, 
                cursor: 'pointer',
                bgcolor: read ? 'background.paper' : 'action.hover',
                borderLeft: !read ? '4px solid #1976d2' : '4px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                    boxShadow: 3
                }
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Chip label={notification.Type} color={getColor(notification.Type)} size="small" />
                    <Typography variant="caption" color="text.secondary">
                        {notification.Timestamp}
                    </Typography>
                </Box>
                <Typography variant="body1" fontWeight={!read ? 'bold' : 'normal'}>
                    {notification.Message}
                </Typography>
            </CardContent>
        </Card>
    );
}
