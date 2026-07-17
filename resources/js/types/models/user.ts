export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at?: string | null;
    created_at?: string;
    roles?: { name: string }[];
    assigned_users?: User[];
    assigned_to_user?: User;
    permissions: { name: string }[];
}
