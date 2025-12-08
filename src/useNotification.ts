// Client-side notification
export function useNotification() {
    let isSupported = typeof globalThis !== 'undefined' && 'Notification' in globalThis;

    let requestAndShowNotification = async (title: string, options?: NotificationOptions) => {
        if (!isSupported) {
            console.error('Browser does not support notifications.');
            return;
        }
        try {
            if (Notification.permission === 'granted') {
                new Notification(title, options);
                return;
            }
            if (Notification.permission === 'denied') {
                // User explicitly denied notifications; do not request again.
                console.warn('Notification permission is denied.');
                return;
            }
            let permission = await Notification.requestPermission();
            if (permission === 'granted') {
                new Notification(title, options);
            }
        } catch (err) {
            console.error('Failed to show notification:', err);
        }
    };
    return { requestAndShowNotification, isSupported };
}