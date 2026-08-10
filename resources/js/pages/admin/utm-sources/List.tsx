import { Head, Link, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Pen, Plus, Trash2 } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import AdvancedTable from '@/components/advanced-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboard } from '@/routes/admin';
import admin from '@/routes/admin';
import type { UtmSource } from '@/types/models/utm-source';

export default function List() {
    const { delete: destroy } = useForm();
    const { hasPermission } = usePermissions();
    const tableRef = useRef<{ fetchData: () => void }>(null);
    const [utmSourceToDelete, setUtmSourceToDelete] =
        useState<UtmSource | null>(null);

    const confirmDelete = () => {
        if (!utmSourceToDelete) {
            return;
        }

        destroy(admin.utmSources.destroy.url(utmSourceToDelete.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setUtmSourceToDelete(null);
                tableRef.current?.fetchData();
            },
        });
    };

    const columns = useMemo<ColumnDef<UtmSource>[]>(
        () => [
            {
                id: 'name',
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">{row.original.name}</div>
                        <div className="text-xs text-muted-foreground">
                            {row.original.description}
                        </div>
                    </div>
                ),
            },
            {
                id: 'code',
                header: 'Code',
                accessorKey: 'code',
                cell: ({ row }) => (
                    <span className="font-mono text-sm">
                        {row.original.code}
                    </span>
                ),
            },
            {
                id: 'visits_count',
                header: 'Total Visits',
                accessorKey: 'visits_count',
            },
            {
                id: 'registrations_count',
                header: 'Registrations',
                accessorKey: 'registrations_count',
            },
            {
                id: 'is_active',
                header: 'Status',
                accessorKey: 'is_active',
                cell: ({ row }) => (
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${row.original.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                        {row.original.is_active ? 'Active' : 'Inactive'}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex justify-end space-x-2 text-right">
                        {hasPermission('Edit UTM Sources') && (
                            <Button variant="outline" size="sm" asChild>
                                <Link
                                    href={admin.utmSources.edit.url(
                                        row.original.id,
                                    )}
                                >
                                    <Pen className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                        {hasPermission('Delete UTM Sources') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setUtmSourceToDelete(row.original)
                                }
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                ),
            },
        ],
        [hasPermission],
    );

    return (
        <>
            <Head title="UTM Sources" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            UTM Sources
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage marketing campaigns and UTM tracking sources.
                        </p>
                    </div>
                    {hasPermission('Create UTM Sources') && (
                        <Button asChild>
                            <Link href={admin.utmSources.create.url()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Source
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="mt-4">
                    <AdvancedTable
                        ref={tableRef}
                        columnsDetails={columns}
                        dataUrl={admin.utmSources.search.url()}
                        pinnedColumns={{}}
                        enableColumnOrdering={true}
                        enableColumnVisibility={true}
                    />
                </div>
            </div>

            <ConfirmDialog
                open={!!utmSourceToDelete}
                onOpenChange={(isOpen) => !isOpen && setUtmSourceToDelete(null)}
                title="Delete UTM Source"
                description={`Are you sure you want to delete the UTM source "${utmSourceToDelete?.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
            />
        </>
    );
}

List.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'UTM Sources', href: admin.utmSources.index.url() },
    ],
};
