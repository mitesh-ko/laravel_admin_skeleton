import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, ShieldCheck, Server } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Admin Portal" />
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground">
                {/* Background decorative elements */}
                <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/20"></div>
                <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/20"></div>

                <header className="absolute top-0 z-50 w-full p-6">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="h-6 w-6 fill-current text-foreground" />
                            <span className="font-semibold tracking-tight">
                                Admin System
                            </span>
                        </div>
                        <AppearanceDropdown />
                    </nav>
                </header>

                <main className="relative z-10 w-full max-w-md animate-in px-6 duration-700 fade-in slide-in-from-bottom-8">
                    <div className="rounded-3xl border border-border/50 bg-card/60 p-10 text-center shadow-2xl backdrop-blur-xl">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-inner">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold tracking-tight">
                            Admin Portal
                        </h1>
                        <p className="mb-8 text-sm text-muted-foreground">
                            Secure management interface for system
                            administrators and staff personnel.
                        </p>

                        <div className="space-y-4">
                            {auth.user ? (
                                <Button
                                    asChild
                                    className="h-12 w-full rounded-xl text-base shadow-lg transition-transform active:scale-[0.98]"
                                >
                                    <Link href={dashboard()}>
                                        Access Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <Button
                                        asChild
                                        className="h-12 w-full rounded-xl text-base shadow-lg transition-transform active:scale-[0.98]"
                                    >
                                        <Link href={login()}>
                                            Administrator Login
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="h-12 w-full rounded-xl transition-colors"
                                    >
                                        <Link href={register()}>
                                            Apply for Access
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center gap-6 border-t border-border/50 pt-6 text-muted-foreground">
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Secure</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                <Server className="h-3.5 w-3.5" />
                                <span>Fast</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                <Activity className="h-3.5 w-3.5" />
                                <span>Reliable</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
