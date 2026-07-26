export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

/**
 * Typed representation of shared Inertia page props
 * (mirrors the InertiaConfig.sharedPageProps declaration in global.d.ts)
 */
export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    dateFormats: {
        date: string;
        datetime: string;
    };
    [key: string]: unknown;
}

export interface DatabaseNotification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: string;
    data: {
        title?: string;
        message?: string;
        action_label?: string;
        action_url?: string;
        [key: string]: unknown;
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export * from './dashboard';
