import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import React from 'react';
import AdvancedTable from '@/components/advanced-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppFormat } from '@/hooks/use-app-format';
import admin from '@/routes/admin';

type Audit = {
    id: string | number;
    event: string;
    auditable_type: string;
    user: { name: string } | null;
    ip_address: string;
    created_at: string;
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

    const getEventBadgeStyles = (event: string) => {
        switch (event.toLowerCase()) {
            case 'created':
                return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/30 border-transparent';
            case 'updated':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/30 border-transparent';
            case 'deleted':
                return 'bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/30 border-transparent';
            case 'restored':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/30 border-transparent';
            default:
                return 'bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 border-transparent';
        }
    };

    const columns = React.useMemo<ColumnDef<Audit>[]>(
        () => [
            {
                accessorKey: 'event',
                header: 'Action',
                enableSorting: false,
                cell: ({ row }) => {
                    const event = row.original.event;

                    return (
                        <Badge
                            variant="outline"
                            className={`rounded-full px-2.5 py-0.5 capitalize ${getEventBadgeStyles(event)}`}
                        >
                            {event}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'user.name',
                header: 'User',
                cell: ({ row }) => row.original.user?.name || 'System',
            },
            {
                accessorKey: 'auditable_type',
                header: 'Module',
                cell: ({ row }) => {
                    const type = row.original.auditable_type;

                    return type.split('\\').pop();
                },
            },
            {
                accessorKey: 'ip_address',
                enableSorting: false,
                header: 'IP Address',
            },
            {
                accessorKey: 'created_at',
                header: 'Date & Time',
                cell: ({ row }) => formatDateTime(row.original.created_at),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    return (
                        <div className="flex justify-end gap-2 pr-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link
                                    href={admin.activityLogs.show.url(
                                        Number(row.original.id),
                                    )}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Link>
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [formatDateTime],
    );

    return (
        <>
            <Head title="Activity Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {userName
                            ? `Activity Logs of "${userName}"`
                            : 'Activity Logs'}
                    </h2>
                </div>

                <div className="mt-4">
                    <AdvancedTable
                        ref={tableRef}
                        columnsDetails={columns}
                        dataUrl={admin.activityLogs.search.url({
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
            title: 'Activity Logs',
            href: admin.activityLogs.index.url(),
        },
    ],
};
