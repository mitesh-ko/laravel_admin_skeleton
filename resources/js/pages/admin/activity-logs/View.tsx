import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAppFormat } from '@/hooks/use-app-format';
import admin from '@/routes/admin';

import type { AuditDetail } from '@/types/models/audit';

interface ViewProps {
    audit: AuditDetail;
}

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="grid grid-cols-[150px_1fr] items-center gap-4 border-b border-border/50 px-4 py-3 transition-colors last:border-0 hover:bg-muted/50">
        <div className="flex justify-between pr-4 text-muted-foreground">
            <span>{label}</span>
            <span className="text-primary/50">:</span>
        </div>
        <div className="break-all text-foreground">{value}</div>
    </div>
);

const ValueTable = ({
    values,
    type,
}: {
    values: Record<string, unknown>;
    type: 'old' | 'new';
}) => {
    const hasValues = values && Object.keys(values).length > 0;

    return (
        <div className="flex-1 space-y-3">
            <span
                className={`inline-block rounded-md px-3 py-1 text-xs font-semibold ${
                    type === 'old'
                        ? 'bg-orange-500/90 text-white dark:bg-orange-600/90'
                        : 'bg-emerald-500/90 text-white dark:bg-emerald-600/90'
                }`}
            >
                {type === 'old' ? 'Old Value' : 'New Value'}
            </span>

            <div className="flex min-h-[120px] flex-col overflow-hidden rounded-md border border-border bg-card/50">
                {!hasValues ? (
                    <div className="flex flex-1 items-center justify-center py-8 text-sm text-muted-foreground">
                        No {type} value
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {Object.entries(values).map(([key, value]) => (
                            <div
                                key={key}
                                className="grid grid-cols-[120px_1fr] items-center gap-4 border-b border-border/50 px-4 py-2.5 transition-colors last:border-0 hover:bg-muted/50"
                            >
                                <div className="flex justify-between pr-4 text-sm text-muted-foreground">
                                    <span>{key}</span>
                                    <span className="text-primary/50">:</span>
                                </div>
                                <div
                                    className="truncate font-mono text-sm text-foreground"
                                    title={String(value)}
                                >
                                    "{String(value)}"
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function View({ audit }: ViewProps) {
    const { formatDateTime } = useAppFormat();

    return (
        <>
            <Head title="View Activity Log" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="rounded-lg border border-border bg-card shadow-sm">
                    {/* Top Details Section */}
                    <div className="flex flex-col">
                        <DetailRow
                            label="User Type"
                            value={audit.user_type || 'N/A'}
                        />
                        <DetailRow
                            label="User"
                            value={audit.user?.name || 'System'}
                        />
                        <DetailRow
                            label="Module"
                            value={audit.auditable_type?.split('\\').pop()}
                        />
                        <DetailRow label="Action" value={audit.event} />
                        <DetailRow
                            label="Time"
                            value={formatDateTime(audit.created_at)}
                        />
                        <DetailRow label="URL" value={audit.url || 'N/A'} />
                        <DetailRow
                            label="IP Address"
                            value={audit.ip_address || 'N/A'}
                        />
                        <DetailRow
                            label="User Agent"
                            value={audit.user_agent || 'N/A'}
                        />
                    </div>
                </div>

                {/* Bottom Old/New Values Section */}
                <div className="flex flex-col gap-6 md:flex-row">
                    <ValueTable values={audit.old_values} type="old" />
                    <ValueTable values={audit.new_values} type="new" />
                </div>

                {/* Footer Action */}
                <div className="mt-4">
                    <Button
                        variant="secondary"
                        asChild
                        className="bg-muted text-foreground hover:bg-muted/80"
                    >
                        <Link href={admin.activityLogs.index.url()}>Back</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

View.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '#',
        },
        {
            title: 'Activity Logs',
            href: admin.activityLogs.index.url(),
        },
        {
            title: 'View',
            href: '#',
        },
    ],
};
