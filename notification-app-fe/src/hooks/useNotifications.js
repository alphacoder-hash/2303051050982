import { useState, useEffect } from 'react';
import { fetchNotifications } from '../api/notifications';
import { Log } from 'logging-middleware';

export function useNotifications(page, limit, type) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadNotifications = async () => {
            setLoading(true);
            setError(null);
            try {
                await Log("frontend", "info", "hook", `useNotifications hook running with page=${page}`);
                const data = await fetchNotifications(page, limit, type);
                if (isMounted) {
                    setNotifications(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadNotifications();

        return () => {
            isMounted = false;
        };
    }, [page, limit, type]);

    return { notifications, loading, error };
}
