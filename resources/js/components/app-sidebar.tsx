import { Link } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Mail,
    ShieldHalf,
    Users,
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

type AppNavItem = NavItem & { permission?: string };

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
        permission: 'Manage Activity Logs',
        items: [
            {
                title: 'Activity Logs',
                href: admin.activityLogs.index.url(),
            },
            {
                title: 'Authentication Logs',
                href: admin.authenticationLogs.index.url(),
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
        title: 'Mail Templates',
        href: admin.mailTemplates.index.url(),
        icon: Mail,
        permission: 'Manage Mail Templates',
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

    const filteredNavItems = mainNavItems.filter(
        (item) => !item.permission || hasPermission(item.permission),
    );

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
