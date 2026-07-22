import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import * as React from 'react';
import AdvancedTable from '@/components/advanced-table';
import { Button } from '@/components/ui/button';
import admin from '@/routes/admin';

type MailTemplate = {
    id: string;
    key: string;
    subject: string;
    created_at: string;
};

export default function List() {
    const tableRef = React.useRef<{ fetchData: () => void }>(null);

    const columns = React.useMemo<ColumnDef<MailTemplate>[]>(
        () => [
            {
                accessorKey: 'key',
                header: 'Template Key',
            },
            {
                accessorKey: 'subject',
                header: 'Subject',
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    return (
                        <div className="flex justify-end gap-2 pr-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link
                                    href={admin.mailTemplates.edit.url(
                                        row.original.id,
                                    )}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return (
        <>
            <Head title="Mail Templates" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Mail Templates
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage the email templates used across the system.
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <AdvancedTable
                        ref={tableRef}
                        columnsDetails={columns}
                        dataUrl={admin.mailTemplates.search.url()}
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
            title: 'Email Template',
            href: admin.mailTemplates.index.url(),
        },
    ],
};
