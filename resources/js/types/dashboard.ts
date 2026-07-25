export interface ActivityLog {
    id: number;
    user_name: string;
    event: string;
    auditable_type: string;
    created_at: string;
}

export interface LoginChartData {
    date: string;
    logins: number;
}

export interface UtmTrafficData {
    source: string;
    campaign: string;
    count: number;
}

export interface UtmRegistrationData {
    source: string;
    campaign: string;
    count: number;
}
