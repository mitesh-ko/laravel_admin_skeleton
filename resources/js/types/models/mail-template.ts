export interface MailTemplate {
    id: string;
    key: string;
    name: string;
    subject: string;
    html_content: string;
    available_snippets?: string[] | null;
}
