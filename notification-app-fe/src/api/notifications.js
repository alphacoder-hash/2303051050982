import { Log } from 'logging-middleware';
import { getValidToken } from './auth';

export async function fetchNotifications(page = 1, limit = 10, type = '') {
    await Log("frontend", "info", "api", `Fetching notifications: page=${page}, limit=${limit}, type=${type}`);

    const token = await getValidToken();

    let url = `/api/notifications?page=${page}&limit=${limit}`;
    if (type) url += `&notification_type=${type}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        await Log("frontend", "info", "api", `Successfully fetched notifications`);
        return data.notifications || [];
    } catch (error) {
        await Log("frontend", "error", "api", `Error fetching notifications: ${error.message}`);
        throw error;
    }
}
