import { Link } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Mail,
    Settings,
    ShieldHalf,
    Users,
    Megaphone,
    DownloadCloud,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';

type AppNavItem = Omit<NavItem, 'items'> & {
    permission?: string | string[];
    items?: Omit<AppNavItem, 'icon' | 'items'>[];
};

const mainNavItems: AppNavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: admin.users.index.url(),
        icon: Users,
        permission: 'Manage Users',
    },
    {
        title: 'Logs',
        href: '#',
        icon: Activity,
        permission: ['Manage Activity Logs', 'Manage Authentication Logs'],
        items: [
            {
                title: 'Activity Logs',
                href: admin.activityLogs.index.url(),
                permission: 'Manage Activity Logs',
            },
            {
                title: 'Authentication Logs',
                href: admin.authenticationLogs.index.url(),
                permission: 'Manage Authentication Logs',
            },
        ],
    },
    {
        title: 'Roles',
        href: admin.roles.index.url(),
        icon: ShieldHalf,
        permission: 'Manage Roles',
    },
    {
        title: 'UTM Sources',
        href: admin.utmSources.index.url(),
        icon: Megaphone,
        permission: 'Manage UTM Sources',
    },
    {
        title: 'File Exports',
        href: admin.fileExports.index.url(),
        icon: DownloadCloud,
    },
    {
        title: 'Mail Templates',
        href: admin.mailTemplates.index.url(),
        icon: Mail,
        permission: 'Manage Mail Templates',
    },
    {
        title: 'System Settings',
        href: '#',
        icon: Settings,
        permission: ['Manage General Settings', 'Manage Mail Settings'],
        items: [
            {
                title: 'General Settings',
                href: admin.settings.editGeneral.url(),
                permission: 'Manage General Settings',
            },
            {
                title: 'Mail Settings',
                href: admin.settings.editMail.url(),
                permission: 'Manage Mail Settings',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { hasPermission } = usePermissions();

    const filterItem = (item: AppNavItem): AppNavItem | null => {
        if (item.permission) {
            const hasAccess = Array.isArray(item.permission)
                ? item.permission.some(hasPermission)
                : hasPermission(item.permission);

            if (!hasAccess) {
                return null;
            }
        }

        if (item.items) {
            const filteredItems = item.items
                .map(filterItem)
                .filter(Boolean) as Omit<AppNavItem, 'icon' | 'items'>[];

            if (filteredItems.length === 0) {
                return null;
            }

            return { ...item, items: filteredItems };
        }

        return item;
    };

    const filteredNavItems = mainNavItems
        .map(filterItem)
        .filter(Boolean) as AppNavItem[];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
