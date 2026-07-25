export interface Audit {
    id: string | number;
    event: string;
    auditable_type: string;
    user: { name: string } | null;
    ip_address: string;
    created_at: string;
}

export interface AuditDetail extends Audit {
    user_type: string;
    user_id: string | number;
    old_values: Record<string, unknown>;
    new_values: Record<string, unknown>;
    url: string;
    user_agent: string;
}
