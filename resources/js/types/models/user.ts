export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at?: string | null;
    created_at?: string;
    roles?: { name: string }[];
}
