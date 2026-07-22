import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';
import AdvancedTable from '@/components/advanced-table';
import { useAppFormat } from '@/hooks/use-app-format';
import admin from '@/routes/admin';

type AuthLog = {
    id: string | number;
    authenticatable: { name: string } | null;
    ip_address: string;
    user_agent: string;
    login_at: string | null;
    login_successful: boolean;
    logout_at: string | null;
    location: string | null;
};

export default function List({
    userId,
    userName,
}: {
    userId?: string;
    userName?: string;
}) {
    const { formatDateTime } = useAppFormat();
    const tableRef = React.useRef<{ fetchData: () => void }>(null);

    const columns = React.useMemo<ColumnDef<AuthLog>[]>(
        () => [
            {
                accessorKey: 'authenticatable.name',
                header: 'User',
                cell: ({ row }) =>
                    row.original.authenticatable?.name || 'Unknown',
            },
            {
                accessorKey: 'ip_address',
                enableSorting: false,
                header: 'IP Address',
            },
            {
                accessorKey: 'location',
                enableSorting: false,
                header: 'Location',
                cell: ({ row }) => row.original.location || '-',
            },
            {
                accessorKey: 'user_agent',
                enableSorting: false,
                header: 'Browser/User Agent',
                cell: ({ row }) => {
                    const ua = row.original.user_agent || '-';

                    return (
                        <span
                            className="inline-block max-w-[200px] truncate text-xs text-muted-foreground"
                            title={ua}
                        >
                            {ua}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'login_successful',
                header: 'Status',
                cell: ({ row }) => {
                    const isSuccess = row.original.login_successful;

                    return (
                        <div className="flex items-center gap-1.5">
                            {isSuccess ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                        Success
                                    </span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 text-rose-500" />
                                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                                        Failed
                                    </span>
                                </>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'login_at',
                header: 'Login Time',
                cell: ({ row }) =>
                    row.original.login_at
                        ? formatDateTime(row.original.login_at)
                        : '-',
            },
            {
                accessorKey: 'logout_at',
                header: 'Logout Time',
                cell: ({ row }) =>
                    row.original.logout_at
                        ? formatDateTime(row.original.logout_at)
                        : '-',
            },
        ],
        [formatDateTime],
    );

    return (
        <>
            <Head title="Authentication Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {userName
                                ? `Authentication Logs of "${userName}"`
                                : 'Authentication Logs'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Monitor successful and failed logins across the
                            system.
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <AdvancedTable
                        ref={tableRef}
                        columnsDetails={columns}
                        dataUrl={admin.authenticationLogs.search.url({
                            query: { user_id: userId },
                        })}
                        pinnedColumns={{}}
                        enableColumnOrdering={true}
                        enableColumnVisibility={true}
                    />
                </div>
            </div>
        </>
    );
}

List.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '#',
        },
        {
            title: 'Authentication Logs',
            href: admin.authenticationLogs.index.url(),
        },
    ],
};
