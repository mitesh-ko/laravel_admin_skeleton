export interface UtmSource {
    id: string;
    name: string;
    code: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string | null;
    utm_term: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;

    visits_count?: number;
    registrations_count?: number;
}
