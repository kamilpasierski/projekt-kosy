export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    is_read: boolean;
    target_url?: string;
}