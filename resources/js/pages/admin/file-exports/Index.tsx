import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DownloadCloud, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useRef, useMemo } from 'react';
import AdvancedTable from '@/components/advanced-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppFormat } from '@/hooks/use-app-format';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

interface FileExport {
    id: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    details: any;
    error_message: string | null;
    completed_at: string | null;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: admin.dashboard().url },
    { title: 'File Exports', href: admin.fileExports.index.url() },
];

export default function FileExportsIndex() {
    const { formatDateTime } = useAppFormat();
    const tableRef = useRef<{ fetchData: () => void }>(null);

    const columns = useMemo<ColumnDef<FileExport>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.original.status;

                    return (
                        <div className="flex items-center">
                            {status === 'completed' && (
                                <Badge
                                    variant="default"
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    <CheckCircle2 className="mr-1 h-3 w-3" />{' '}
                                    Completed
                                </Badge>
                            )}
                            {status === 'failed' && (
                                <Badge variant="destructive">
                                    <XCircle className="mr-1 h-3 w-3" /> Failed
                                </Badge>
                            )}
                            {(status === 'pending' ||
                                status === 'processing') && (
                                <Badge variant="secondary">
                                    <Clock className="mr-1 h-3 w-3" /> {status}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'details',
                header: 'Details',
                enableSorting: false,
                cell: ({ row }) => {
                    const item = row.original;

                    return (
                        <div>
                            {item.details ? (
                                <pre className="max-w-xs truncate text-xs text-muted-foreground">
                                    {JSON.stringify(item.details)}
                                </pre>
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    -
                                </span>
                            )}
                            {item.error_message && (
                                <p className="mt-1 text-xs text-red-500">
                                    {item.error_message}
                                </p>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'created_at',
                header: 'Requested',
                cell: ({ row }) => formatDateTime(row.original.created_at),
            },
            {
                accessorKey: 'completed_at',
                header: 'Completed',
                cell: ({ row }) =>
                    row.original.completed_at
                        ? formatDateTime(row.original.completed_at)
                        : '-',
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                cell: ({ row }) => {
                    const item = row.original;

                    return (
                        <div className="flex justify-end text-right">
                            {item.status === 'completed' ? (
                                <Button size="sm" variant="outline" asChild>
                                    <a
                                        href={admin.fileExports.download.url({
                                            fileExport: item.id,
                                        })}
                                    >
                                        <DownloadCloud className="mr-2 h-4 w-4" />
                                        Download
                                    </a>
                                </Button>
                            ) : (
                                <Button size="sm" variant="outline" disabled>
                                    <DownloadCloud className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            )}
                        </div>
                    );
                },
            },
        ],
        [formatDateTime],
    );

    return (
        <>
            <Head title="File Exports" />

            <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            File Exports
                        </h2>
                        <p className="text-muted-foreground">
                            View and download your requested file exports.
                            <span className="block text-xs text-orange-500">
                                Note: The system automatically cleans export
                                data daily. Yesterday's generated files are not
                                kept to conserve storage.
                            </span>
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <AdvancedTable
                        ref={tableRef}
                        columnsDetails={columns}
                        dataUrl={admin.fileExports.search.url()}
                        pinnedColumns={{}}
                        enableColumnOrdering={true}
                        enableColumnVisibility={true}
                    />
                </div>
            </div>
        </>
    );
}

FileExportsIndex.layout = {
    breadcrumbs: breadcrumbs,
};
