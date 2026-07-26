import { usePage, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import admin from '@/routes/admin';
import type { BreadcrumbItem as BreadcrumbItemType, SharedData } from '@/types';
import AppearanceDropdown from './appearance-dropdown';
import { NotificationDropdown } from './notification-dropdown';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const isImpersonating = auth.isImpersonating;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                {isImpersonating && (
                    <Button variant="destructive" size="sm" asChild>
                        <Link
                            href={admin.impersonate.leave.url()}
                            method="post"
                            as="button"
                        >
                            Leave Impersonation
                        </Link>
                    </Button>
                )}
                <NotificationDropdown />
                <AppearanceDropdown />
            </div>
        </header>
    );
}
