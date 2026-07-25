export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

/**
 * Typed representation of shared Inertia page props
 * (mirrors the InertiaConfig.sharedPageProps declaration in global.d.ts)
 */
export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    dateFormats: {
        date: string;
        datetime: string;
    };
    [key: string]: unknown;
};
