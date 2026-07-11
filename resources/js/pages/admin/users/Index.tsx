import { Head, Link, useForm } from '@inertiajs/react';
import type { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import AdvancedTable from '@/components/ui/advanced-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

interface User {
    id: number;
    name: string;
    email: string;
    roles?: { name: string }[];
}

interface IndexProps {
    flash?: {
        success?: string;
    };
}

export default function Index({ flash }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(admin.users.destroy.url(id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Ideally, we'd trigger a table refresh here via a ref
                    window.location.reload();
                },
            });
        }
    };

    const columns = React.useMemo<MRT_ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'roles',
                header: 'Roles',
                enableSorting: false,
                Cell: ({ row }) => {
                    const userRoles = row.original.roles;

                    return (
                        <div className="flex flex-wrap gap-1">
                            {userRoles?.map((role) => (
                                <Badge key={role.name} variant="secondary">
                                    {role.name}
                                </Badge>
                            ))}
                            {(!userRoles || userRoles.length === 0) && (
                                <span className="text-xs text-muted-foreground italic">
                                    No roles
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                enableColumnActions: false,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    const user = row.original;

                    return (
                        <div className="flex justify-end space-x-2 text-right">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={admin.users.edit.url(user.id)}>
                                    Edit
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(user.id)}
                            >
                                Delete
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
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                    <Button asChild>
                        <Link href={admin.users.create.url()}>Create User</Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded bg-green-500/10 p-4 text-green-500">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-hidden rounded-md border shadow-sm">
                    <AdvancedTable
                        columnsDetails={columns}
                        apiUrl={admin.users.search.url()}
                        tableOptions={
                            {
                                // initialState: {
                                //     showGlobalFilter: true,
                                // }
                            }
                        }
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
                title: 'Users',
                href: admin.users.index.url(),
            },
        ]}
    >
        {page}
    </AppLayout>
);
