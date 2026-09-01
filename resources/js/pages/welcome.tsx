import { Head, Link, usePage } from '@inertiajs/react';
import { ShieldCheck, Activity, Users, Settings, Zap, Key } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';
import { dashboard } from '@/routes/admin';

export default function Welcome() {
    const { auth } = usePage().props;

    const features = [
        {
            title: 'Role-Based Access',
            description:
                'Granular permissions and role management out of the box. Assign roles dynamically to secure your application routes and data.',
            icon: <ShieldCheck className="h-6 w-6 text-primary" />,
        },
        {
            title: 'Activity Logging',
            description:
                'Comprehensive audit trails for every user action. Keep track of what happens in your system securely and efficiently.',
            icon: <Activity className="h-6 w-6 text-primary" />,
        },
        {
            title: 'User Management',
            description:
                'Easily manage users, impersonate accounts for debugging, and export user data seamlessly.',
            icon: <Users className="h-6 w-6 text-primary" />,
        },
        {
            title: 'Dynamic Settings',
            description:
                'Configure global application parameters and mail settings directly from the UI without touching the .env file.',
            icon: <Settings className="h-6 w-6 text-primary" />,
        },
        {
            title: 'System Health',
            description:
                'Monitor server performance, view detailed application logs, and clear cache via the dedicated system health dashboard.',
            icon: <Zap className="h-6 w-6 text-primary" />,
        },
        {
            title: 'Authentication & Security',
            description:
                'Pre-configured with passkeys, two-factor authentication (2FA), and secure session management for enterprise-grade security.',
            icon: <Key className="h-6 w-6 text-primary" />,
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
            <Head title="Welcome | Laravel Admin Skeleton" />

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <AppLogoIcon className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight">
                            Admin Skeleton
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        <AppearanceDropdown />
                        {auth.user ? (
                            <Link href={dashboard().url}>
                                <Button variant="default">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={login().url}>
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link href={register().url}>
                                    <Button variant="default">Register</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    ></div>
                </div>

                <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
                        The Ultimate <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:to-blue-400">
                            Laravel Admin Foundation
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                        Jumpstart your next SaaS or enterprise application.
                        Pre-configured with robust authentication, role
                        management, activity logs, and system health monitoring
                        so you can focus on building what matters.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        {auth.user ? (
                            <Link href={dashboard().url}>
                                <Button
                                    size="lg"
                                    className="h-12 px-8 text-base shadow-lg transition-all hover:shadow-primary/25"
                                >
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href={register().url}>
                                <Button
                                    size="lg"
                                    className="h-12 px-8 text-base shadow-lg transition-all hover:shadow-primary/25"
                                >
                                    Get Started Today
                                </Button>
                            </Link>
                        )}
                        <a
                            href="#features"
                            className="text-sm leading-6 font-semibold text-foreground transition-colors hover:text-primary"
                        >
                            Explore features <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                className="border-y border-border/50 bg-muted/30 py-24"
            >
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 max-w-3xl">
                        <h2 className="text-base leading-7 font-semibold text-primary">
                            Everything you need
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            A complete admin skeleton ready for production
                        </p>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            We've eliminated the boilerplate so you don't have
                            to spend weeks setting up essential administrative
                            tools and security measures.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group relative flex flex-col items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-8 shadow-sm backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-md dark:hover:bg-muted/20"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-border/40 py-10">
                <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:px-6 md:flex-row lg:px-8">
                    <div>
                        &copy; {new Date().getFullYear()} Laravel Admin
                        Skeleton. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a
                            href="https://laravel.com"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-foreground"
                        >
                            Laravel
                        </a>
                        <a
                            href="https://ui.shadcn.com"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-foreground"
                        >
                            Shadcn UI
                        </a>
                        <a
                            href="https://inertiajs.com"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-foreground"
                        >
                            Inertia.js
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
