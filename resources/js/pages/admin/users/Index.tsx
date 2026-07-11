import { Head, Link, useForm } from '@inertiajs/react';
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
    users: {
        data: User[];
        links: any[];
    };
    flash?: {
        success?: string;
    };
}

export default function Index({ users, flash }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(admin.users.destroy.url(id));
        }
    };

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

                <div className="rounded-md border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Roles</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b transition-colors last:border-0 hover:bg-muted/50"
                                >
                                    <td className="px-4 py-3">{user.name}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.map((role) => (
                                                <Badge
                                                    key={role.name}
                                                    variant="secondary"
                                                >
                                                    {role.name}
                                                </Badge>
                                            ))}
                                            {(!user.roles ||
                                                user.roles.length === 0) && (
                                                <span className="text-xs text-muted-foreground italic">
                                                    No roles
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="space-x-2 px-4 py-3 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={admin.users.edit.url(
                                                    user.id,
                                                )}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
