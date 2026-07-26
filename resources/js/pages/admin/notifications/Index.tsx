import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import admin from '@/routes/admin';
import type { DatabaseNotification, PaginatedData } from '@/types';

interface Props {
    notifications: PaginatedData<DatabaseNotification>;
}

export default function NotificationsIndex({ notifications }: Props) {
    const markAsRead = (id: string) => {
        router.post(
            admin.notifications.markAsRead.url(id),
            {},
            { preserveScroll: true },
        );
    };

    const markAllAsRead = () => {
        router.post(
            admin.notifications.markAllAsRead.url(),
            {},
            { preserveScroll: true },
        );
    };

    const deleteNotification = (id: string) => {
        if (confirm('Are you sure you want to delete this notification?')) {
            router.delete(admin.notifications.destroy.url(id), {
                preserveScroll: true,
            });
        }
    };

    const unreadCount = notifications.data.filter(
        (n) => n.read_at === null,
    ).length;

    return (
        <>
            <Head title="Notifications" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 p-4 md:mx-auto md:max-w-7xl md:p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                You have {unreadCount} unread notification
                                {unreadCount !== 1 ? 's' : ''} on this page.
                            </CardDescription>
                        </div>
                        {unreadCount > 0 && (
                            <Button variant="outline" onClick={markAllAsRead}>
                                <CheckCheck className="mr-2 h-4 w-4" />
                                Mark all as read
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {notifications.data.length === 0 ? (
                            <div className="flex h-32 items-center justify-center text-muted-foreground">
                                No notifications found.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`flex flex-col gap-2 rounded-lg border p-4 transition-colors md:flex-row md:items-start md:justify-between ${
                                            notification.read_at === null
                                                ? 'border-primary/20 bg-muted/50'
                                                : 'border-border bg-background'
                                        }`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="leading-none font-semibold tracking-tight">
                                                    {notification.data?.title ||
                                                        'Notification'}
                                                </h4>
                                                {notification.read_at ===
                                                    null && (
                                                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.data?.message ||
                                                    ''}
                                            </p>
                                            {notification.data?.action_label &&
                                                notification.data
                                                    ?.action_url && (
                                                    <a
                                                        href={
                                                            notification.data
                                                                .action_url
                                                        }
                                                        className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline"
                                                        onClick={() =>
                                                            notification.read_at ===
                                                                null &&
                                                            markAsRead(
                                                                notification.id,
                                                            )
                                                        }
                                                    >
                                                        {
                                                            notification.data
                                                                .action_label
                                                        }
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                            <p className="pt-1 text-xs text-muted-foreground">
                                                {formatDistanceToNow(
                                                    new Date(
                                                        notification.created_at,
                                                    ),
                                                    {
                                                        addSuffix: true,
                                                    },
                                                )}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 md:mt-0">
                                            {notification.read_at === null && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id,
                                                        )
                                                    }
                                                >
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Mark as read
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification.id,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Basic pagination controls can go here */}
                        <div className="mt-6 flex items-center justify-between">
                            <Button
                                variant="outline"
                                disabled={!notifications.prev_page_url}
                                onClick={() =>
                                    notifications.prev_page_url &&
                                    router.get(notifications.prev_page_url)
                                }
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {notifications.current_page} of{' '}
                                {notifications.last_page}
                            </span>
                            <Button
                                variant="outline"
                                disabled={!notifications.next_page_url}
                                onClick={() =>
                                    notifications.next_page_url &&
                                    router.get(notifications.next_page_url)
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '#',
        },
        {
            title: 'Notifications',
            href: admin.notifications.index.url(),
        },
    ],
};
