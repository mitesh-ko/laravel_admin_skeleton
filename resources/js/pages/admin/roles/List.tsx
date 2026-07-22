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
import admin from '@/routes/admin';
import { SystemRole } from '@/types/roles';

type Role = {
    id: string | number;
    name: string;
    description: string | null;
    permissions_count: number;
    created_at: string;
};

export default function List() {
    const { formatDateTime } = useAppFormat();
    const { hasPermission } = usePermissions();
    const { delete: destroy } = useForm();
    const tableRef = React.useRef<{ fetchData: () => void }>(null);

    const [roleToDelete, setRoleToDelete] = React.useState<{
        id: string;
        name: string;
    } | null>(null);

    const confirmDelete = () => {
        if (!roleToDelete) {
            return;
        }

        destroy(admin.roles.destroy.url(roleToDelete.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setRoleToDelete(null);
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
                cell: ({ row }: any) => {
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
                                        <Edit2 />
                                    </Link>
                                </Button>
                            )}
                            {hasPermission('Delete Roles') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setRoleToDelete({
                                            id: row.original.id,
                                            name: row.original.name,
                                        })
                                    }
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    );
                },
            },
        ],
        [formatDateTime, hasPermission],
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

            <ConfirmDialog
                open={!!roleToDelete}
                onOpenChange={(open) => !open && setRoleToDelete(null)}
                title="Delete Role?"
                description={`Are you sure you want to delete the role "${roleToDelete?.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
                confirmText="Delete"
                destructive
            />
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
            title: 'Role',
            href: admin.roles.index.url(),
        },
    ],
};
