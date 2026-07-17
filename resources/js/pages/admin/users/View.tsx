import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Key,
    Shield,
    User as UserIcon,
    CheckCircle2,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppFormat } from '@/hooks/use-app-format';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { User } from '@/types/models/user';

interface ViewProps {
    user: User;
}

export default function View({ user }: ViewProps) {
    const { formatDate } = useAppFormat();
    const userRoleNames = user.roles?.map((r) => r.name) || [];
    const userPermissionNames = user.permissions?.map((p: any) => p.name) || [];

    return (
        <>
            <Head title={`View User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            User Profile
                        </h2>
                        <p className="text-muted-foreground">
                            View details, roles, and permissions for {user.name}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={admin.users.index.url()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                User Details
                            </CardTitle>
                            <CardDescription>
                                Basic information about the user.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Name
                                </h3>
                                <p className="mt-1 text-lg font-semibold">
                                    {user.name}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Email
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <p>{user.email}</p>
                                    {user.email_verified_at && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Email verified</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Created At
                                </h3>
                                <p className="mt-1">
                                    {formatDate(user.created_at)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Assigned Roles */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-muted-foreground" />
                                    Assigned Roles
                                </CardTitle>
                                <CardDescription>
                                    Roles assigned to this user.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {userRoleNames.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {userRoleNames.map((role) => (
                                            <Badge key={role} variant="default">
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        No roles assigned.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Direct Permissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5 text-muted-foreground" />
                                    Direct Permissions
                                </CardTitle>
                                <CardDescription>
                                    Permissions assigned directly to this user
                                    (excluding role permissions).
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {userPermissionNames.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {userPermissionNames.map(
                                            (permission) => (
                                                <Badge
                                                    key={permission}
                                                    variant="secondary"
                                                >
                                                    {permission}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        No direct permissions assigned.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
View.layout = (page: any) => (
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
