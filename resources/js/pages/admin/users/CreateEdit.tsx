import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultiSelect from '@/components/ui/multi-select';
import admin from '@/routes/admin';
import type { User } from '@/types/models/user';

interface CreateEditProps {
    user?: User; // Optional, present in edit mode
    roles: string[];
    permissions: string[];
    users: { id: string; name: string }[];
}

export default function CreateEdit({
    user,
    roles,
    permissions,
    users,
}: CreateEditProps) {
    const isEdit = !!user;
    const userRoleNames = user?.roles?.map((r) => r.name) || [];
    const userPermissionNames =
        user?.permissions?.map((p: any) => p.name) || [];
    const userAssignedUsers = user?.assigned_users?.map((u: any) => u.id) || [];

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        roles: userRoleNames,
        permissions: userPermissionNames,
        assigned_users: userAssignedUsers,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(admin.users.update.url(user.id));
        } else {
            post(admin.users.store.url());
        }
    };

    return (
        <>
            <Head title={isEdit ? `Edit User: ${user.name}` : 'Create User'} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEdit ? `Edit User: ${user.name}` : 'Create User'}
                    </h2>
                    <Button variant="outline" asChild>
                        <Link href={admin.users.index.url()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>

                <div className="max-w-2xl rounded-md border bg-card p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                autoFocus
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label>Roles</Label>
                            <MultiSelect
                                isMulti
                                name="roles"
                                options={roles.map((role) => ({
                                    value: role,
                                    label: role,
                                }))}
                                value={data.roles.map((role) => ({
                                    value: role,
                                    label: role,
                                }))}
                                onChange={(selected) =>
                                    setData(
                                        'roles',
                                        selected
                                            ? (selected as any[]).map(
                                                  (option) => option.value,
                                              )
                                            : [],
                                    )
                                }
                                placeholder="Select roles..."
                                className="react-select-container"
                            />
                            {roles.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">
                                    No roles available in the system.
                                </p>
                            )}
                            <InputError message={errors.roles as string} />
                        </div>

                        <div className="space-y-2">
                            <Label>Managed Users</Label>
                            <MultiSelect
                                isMulti={true}
                                name="assigned_users"
                                options={users
                                    .filter((u) => u.id !== user?.id)
                                    .map((u) => ({
                                        value: u.id,
                                        label: u.name,
                                    }))}
                                value={data.assigned_users.map((id) => ({
                                    value: id,
                                    label:
                                        users.find((u) => u.id === id)?.name ||
                                        '',
                                }))}
                                onChange={(selected: any) =>
                                    setData(
                                        'assigned_users',
                                        selected
                                            ? (selected as any[]).map(
                                                  (option) => option.value,
                                              )
                                            : [],
                                    )
                                }
                                placeholder="Select managed users..."
                                className="react-select-container"
                                isClearable
                            />
                            <InputError
                                message={
                                    (errors as any).assigned_users as string
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Direct Permissions</Label>
                            <MultiSelect
                                isMulti
                                name="permissions"
                                options={permissions.map((permission) => ({
                                    value: permission,
                                    label: permission,
                                }))}
                                value={data.permissions.map((permission) => ({
                                    value: permission,
                                    label: permission,
                                }))}
                                onChange={(selected) =>
                                    setData(
                                        'permissions',
                                        selected
                                            ? (selected as any[]).map(
                                                  (option) => option.value,
                                              )
                                            : [],
                                    )
                                }
                                placeholder="Select direct permissions..."
                                className="react-select-container"
                            />
                            {permissions.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">
                                    No permissions available in the system.
                                </p>
                            )}
                            <InputError
                                message={errors.permissions as string}
                            />
                        </div>

                        {!isEdit && (
                            <p className="rounded bg-muted/50 p-3 text-sm text-muted-foreground">
                                Note: A secure password will be auto-generated
                                and emailed to the user.
                            </p>
                        )}

                        <div className="flex items-center justify-end">
                            <Button disabled={processing} type="submit">
                                {isEdit ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

CreateEdit.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '#',
        },
        {
            title: 'Users',
            href: admin.users.index.url(),
        },
        {
            title: 'Manage',
            href: '#',
        },
    ],
};
