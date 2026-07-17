import { Head, Link, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import AdvancedTable from '@/components/advanced-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppFormat } from '@/hooks/use-app-format';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { SystemRole } from '@/types/roles';

type Role = {
    id: string | number;
    name: string;
    description: string | null;
    permissions_count: number;
    created_at: string;
};

export default function Index() {
    const { formatDateTime } = useAppFormat();
    const { hasPermission } = usePermissions();
    const { delete: destroy } = useForm();
    const tableRef = React.useRef<{ fetchData: () => void }>(null);

    const handleDelete = (id: string | number) => {
        destroy(admin.roles.destroy.url(id), {
            preserveScroll: true,
            onSuccess: () => {
                tableRef.current?.fetchData();
            },
        });
    };

    const columns = React.useMemo<ColumnDef<Role>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Role Name',
            },
            {
                accessorKey: 'description',
                header: 'Description',
                cell: ({ row }) => row.original.description || '-',
            },
            {
                accessorKey: 'permissions_count',
                header: 'Permissions',
                cell: ({ row }) => (
                    <Badge variant="secondary">
                        {row.original.permissions_count}
                    </Badge>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                cell: ({ row }) => formatDateTime(row.original.created_at),
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                cell: ({ row }) => {
                    if (row.original.name === SystemRole.SUPER_ADMIN) {
                        return (
                            <span className="text-xs text-muted-foreground">
                                System Role
                            </span>
                        );
                    }

                    return (
                        <div className="flex justify-end gap-2 pr-4">
                            {hasPermission('Edit Roles') && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={admin.roles.edit.url(
                                            row.original.id,
                                        )}
                                    >
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                            {hasPermission('Delete Roles') && (
                                <ConfirmDialog
                                    title="Delete Role?"
                                    description={`Are you sure you want to delete the role "${row.original.name}"? This action cannot be undone.`}
                                    onConfirm={() =>
                                        handleDelete(row.original.id)
                                    }
                                >
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </ConfirmDialog>
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
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
                    {hasPermission('Create Roles') && (
                        <Button asChild>
                            <Link href={admin.roles.create.url()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Role
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="mt-4">
                    <AdvancedTable
                        ref={tableRef}
                        columnsDetails={columns}
                        dataUrl={admin.roles.search.url()}
                        pinnedColumns={{}}
                        enableColumnOrdering={true}
                        enableColumnVisibility={true}
                    />
                </div>
            </div>
        </>
    );
}

Index.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Admin',
                href: '#',
            },
            {
                title: 'Role',
                href: admin.roles.index.url(),
            },
        ]}
    >
        {page}
    </AppLayout>
);
