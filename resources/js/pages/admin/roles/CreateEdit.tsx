import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';

type Permission = {
    id: string;
    name: string;
    module: string;
};

type RoleFormProps = {
    role?: {
        id: string;
        name: string;
        description: string | null;
    };
    groupedPermissions: Record<string, Permission[]>;
    rolePermissions: string[];
};

export default function CreateEdit({
    role,
    groupedPermissions,
    rolePermissions,
}: RoleFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        description: role?.description || '',
        permissions: rolePermissions || [],
    });

    const isEdit = !!role;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(admin.roles.update.url(role.id));
        } else {
            post(admin.roles.store.url());
        }
    };

    // Calculate total permissions for select all logic
    const allPermissions = useMemo(() => {
        return Object.values(groupedPermissions)
            .flat()
            .map((p) => p.name);
    }, [groupedPermissions]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setData('permissions', allPermissions);
        } else {
            setData('permissions', []);
        }
    };

    const handleModuleSelect = (module: string, checked: boolean) => {
        const modulePermissions = groupedPermissions[module].map((p) => p.name);

        if (checked) {
            setData(
                'permissions',
                Array.from(
                    new Set([...data.permissions, ...modulePermissions]),
                ),
            );
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => !modulePermissions.includes(p)),
            );
        }
    };

    const handlePermissionSelect = (
        permissionName: string,
        checked: boolean,
    ) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permissionName),
            );
        }
    };

    const isAllSelected =
        data.permissions.length === allPermissions.length &&
        allPermissions.length > 0;

    return (
        <>
            <Head title={isEdit ? 'Edit Role' : 'Add Role'} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEdit ? 'Edit Role' : 'Add Role'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={admin.roles.index.url()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button onClick={submit} disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {isEdit ? 'Save Changes' : 'Create Role'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Role Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Information</CardTitle>
                            <CardDescription>
                                Enter the role name and an optional description.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Role Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g. HR Manager, Team Lead, Accountant"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter role description..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Permissions</CardTitle>
                            <CardDescription className="space-y-1">
                                <span className="block">
                                    Select permissions for this role. You can
                                    select all permissions at once or manage
                                    them by module.
                                </span>
                                <span className="block text-xs text-orange-500">
                                    Note: Only permissions for modules available
                                    to your role are shown.
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Master Select All */}
                            <div className="flex items-center justify-between rounded-lg border bg-slate-50/50 p-4 dark:bg-slate-900/50">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="selectAll"
                                        checked={isAllSelected}
                                        onCheckedChange={(checked) =>
                                            handleSelectAll(checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor="selectAll"
                                        className="cursor-pointer font-semibold"
                                    >
                                        Select All Permissions
                                    </Label>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {data.permissions.length} of{' '}
                                    {allPermissions.length} selected
                                </div>
                            </div>

                            {/* Modules */}
                            <div className="space-y-4">
                                {Object.entries(groupedPermissions).map(
                                    ([module, permissions]) => {
                                        const modulePermNames = permissions.map(
                                            (p) => p.name,
                                        );
                                        const selectedInModule =
                                            modulePermNames.filter((p) =>
                                                data.permissions.includes(p),
                                            ).length;
                                        const isModuleFullySelected =
                                            selectedInModule ===
                                                modulePermNames.length &&
                                            modulePermNames.length > 0;

                                        return (
                                            <div
                                                key={module}
                                                className="rounded-lg border"
                                            >
                                                {/* Module Header */}
                                                <div className="flex items-center justify-between border-b bg-slate-50/50 p-4 dark:bg-slate-900/50">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`module-${module}`}
                                                            checked={
                                                                isModuleFullySelected
                                                            }
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                handleModuleSelect(
                                                                    module,
                                                                    checked as boolean,
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={`module-${module}`}
                                                            className="cursor-pointer font-semibold"
                                                        >
                                                            {module}
                                                        </Label>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {selectedInModule} of{' '}
                                                        {modulePermNames.length}{' '}
                                                        selected
                                                    </div>
                                                </div>

                                                {/* Module Permissions Grid */}
                                                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
                                                    {permissions.map(
                                                        (permission) => (
                                                            <div
                                                                key={
                                                                    permission.id
                                                                }
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <Checkbox
                                                                    id={`perm-${permission.id}`}
                                                                    checked={data.permissions.includes(
                                                                        permission.name,
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        handlePermissionSelect(
                                                                            permission.name,
                                                                            checked as boolean,
                                                                        )
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`perm-${permission.id}`}
                                                                    className="cursor-pointer text-sm leading-tight font-normal"
                                                                >
                                                                    {
                                                                        permission.name
                                                                    }
                                                                </Label>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                            {errors.permissions && (
                                <p className="mt-2 text-sm text-destructive">
                                    {errors.permissions}
                                </p>
                            )}
                        </CardContent>
                    </Card>
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
            title: 'Role',
            href: admin.roles.index.url(),
        },
        {
            title: 'Manage',
            href: '#',
        },
    ],
};
