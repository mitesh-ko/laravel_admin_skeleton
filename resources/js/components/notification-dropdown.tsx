import { Link, router, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, CheckCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import admin from '@/routes/admin';
import type { DatabaseNotification, SharedData } from '@/types';

export function NotificationDropdown() {
    const { auth } = usePage<SharedData>().props;
    const notifications = (auth.unreadNotifications ||
        []) as DatabaseNotification[];
    const unreadCount = notifications.length;

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="group relative h-9 w-9 cursor-pointer"
                >
                    <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-destructive">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                            onClick={markAllAsRead}
                        >
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                            No new notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex flex-col gap-1 border-b border-border p-3 transition-colors last:border-0 hover:bg-muted/50"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm leading-none font-medium">
                                            {notification.data?.title ||
                                                'Notification'}
                                        </p>
                                        <p className="line-clamp-2 text-xs text-muted-foreground">
                                            {notification.data?.message || ''}
                                        </p>
                                        {notification.data?.action_label &&
                                            notification.data?.action_url && (
                                                <a
                                                    href={
                                                        notification.data
                                                            .action_url
                                                    }
                                                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id,
                                                        )
                                                    }
                                                >
                                                    {
                                                        notification.data
                                                            .action_label
                                                    }
                                                    <ArrowRight className="h-3 w-3" />
                                                </a>
                                            )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0"
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                        title="Mark as read"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                    {formatDistanceToNow(
                                        new Date(notification.created_at),
                                        { addSuffix: true },
                                    )}
                                </span>
                            </div>
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={admin.notifications.index.url()}>
                            View all notifications
                        </Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
