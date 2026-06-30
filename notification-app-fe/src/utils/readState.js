import { Log } from 'logging-middleware';

export const getReadNotifications = () => {
    try {
        const data = localStorage.getItem("read_notifications");
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

export const markAsRead = async (id) => {
    const readList = getReadNotifications();
    if (!readList.includes(id)) {
        readList.push(id);
        localStorage.setItem("read_notifications", JSON.stringify(readList));
        await Log("frontend", "info", "utils", `Marked notification ${id} as read`);
    }
};

export const isRead = (id) => {
    const readList = getReadNotifications();
    return readList.includes(id);
};
