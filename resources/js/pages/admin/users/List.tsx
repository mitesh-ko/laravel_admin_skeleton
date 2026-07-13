import { Head, Link, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pen, Trash2 } from 'lucide-react';
import React from 'react';
import AdvancedTable from '@/components/advanced-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppFormat } from '@/hooks/use-app-format';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { User } from '@/types/models/user';

export default function Index() {
    const { formatDate } = useAppFormat();
    const { delete: destroy } = useForm();
    const tableRef = React.useRef<{ fetchData: () => void }>(null);

    const [userToDelete, setUserToDelete] = React.useState<string | null>(null);

    const handleDelete = (id: string) => {
        setUserToDelete(id);
    };

    const confirmDelete = () => {
        if (!userToDelete) {
            return;
        }

        destroy(admin.users.destroy.url(userToDelete), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setUserToDelete(null);
                tableRef.current?.fetchData();
            },
        });
    };

    const columns = React.useMemo<ColumnDef<User>[]>(
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
                accessorKey: 'created_at',
                header: 'Joined On',
                cell: ({ row }) => {
                    return formatDate(row.original.created_at);
                },
            },
            {
                accessorKey: 'roles',
                header: 'Roles',
                enableSorting: false,
                cell: ({ row }) => {
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
                cell: ({ row }) => {
                    const user = row.original;

                    return (
                        <div className="flex justify-end space-x-2 text-right">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={admin.users.edit.url(user.id)}>
                                    <Pen />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(user.id)}
                            >
                                <Trash2 className="text-destructive" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {}}>
                                        Login
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {}}>
                                        Activity Logs
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {}}>
                                        Auth Logs
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [formatDate],
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

                <div className="mt-4">
                    <AdvancedTable
                        ref={tableRef}
                        columnsDetails={columns}
                        dataUrl={admin.users.search.url()}
                        pinnedColumns={{}}
                        enableColumnOrdering={true}
                        enableColumnVisibility={true}
                    />
                </div>
            </div>

            <ConfirmDialog
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
                title="Are you absolutely sure?"
                description="This action cannot be undone. This will permanently delete the user's account and remove their data from servers."
                onConfirm={confirmDelete}
                confirmText="Delete"
                destructive
            />
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
