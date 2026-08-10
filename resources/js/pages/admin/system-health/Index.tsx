import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import {
    Activity,
    Database,
    RefreshCw,
    Server,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: admin.dashboard().url },
    { title: 'System Health', href: admin.systemHealth.index.url() },
];

export default function SystemHealthIndex({ health }: { health: any }) {
    const [logs, setLogs] = useState<string>('Loading logs...');
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [isClearingCache, setIsClearingCache] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    const fetchLogs = async () => {
        setIsLoadingLogs(true);

        try {
            const response = await axios.get(admin.systemHealth.logs.url());
            setLogs(response.data.log || 'Log file is empty.');
        } catch {
            setLogs(
                'Failed to load logs. You may not have permission, or the file is unreadable.',
            );
        } finally {
            setIsLoadingLogs(false);
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        let isMounted = true;
        axios
            .get(admin.systemHealth.logs.url())
            .then((response) => {
                if (isMounted) {
                    setLogs(response.data.log || 'Log file is empty.');
                }
            })
            .catch(() => {
                if (isMounted) {
                    setLogs(
                        'Failed to load logs. You may not have permission, or the file is unreadable.',
                    );
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoadingLogs(false);
                    scrollToBottom();
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleClearCache = () => {
        setIsClearingCache(true);
        router.post(
            admin.systemHealth.clearCache.url(),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsClearingCache(false),
            },
        );
    };

    const isDbOnline = health.database === 'online';

    return (
        <>
            <Head title="System Health" />

            <div className="flex flex-1 flex-col space-y-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            System Health
                        </h2>
                        <p className="text-muted-foreground">
                            Monitor application status, queues, and raw system
                            logs.
                        </p>
                    </div>
                    <Button
                        onClick={handleClearCache}
                        disabled={isClearingCache}
                        variant="outline"
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${isClearingCache ? 'animate-spin' : ''}`}
                        />
                        {isClearingCache
                            ? 'Clearing...'
                            : 'Clear Application Cache'}
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Database Status
                            </CardTitle>
                            <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {isDbOnline ? 'Online' : 'Offline'}
                                </div>
                                <Badge
                                    variant={
                                        isDbOnline ? 'default' : 'destructive'
                                    }
                                    className={
                                        isDbOnline
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : ''
                                    }
                                >
                                    {isDbOnline ? (
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                    ) : (
                                        <AlertTriangle className="mr-1 h-3 w-3" />
                                    )}
                                    {isDbOnline ? 'Connected' : 'Error'}
                                </Badge>
                            </div>
                            {!isDbOnline && (
                                <p className="mt-2 text-xs text-destructive">
                                    {health.database}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Queue Status ({health.queue.driver})
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {health.queue.driver === 'database' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Pending Jobs
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {health.queue.pending_jobs}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Failed Jobs
                                        </p>
                                        <p className="text-2xl font-bold text-destructive">
                                            {health.queue.failed_jobs}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 text-sm text-muted-foreground">
                                    Metrics not available for{' '}
                                    {health.queue.driver} driver.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="flex flex-1 flex-col overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/50 pb-4">
                        <div className="flex items-center space-x-2">
                            <Server className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Laravel Logs</CardTitle>
                            <CardDescription>
                                storage/logs/laravel.log (Last 1000 lines)
                            </CardDescription>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={fetchLogs}
                            disabled={isLoadingLogs}
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${isLoadingLogs ? 'animate-spin' : ''}`}
                            />
                        </Button>
                    </CardHeader>
                    <CardContent className="relative flex-1 bg-[#0d1117] p-0">
                        <div className="absolute inset-0 overflow-auto p-4">
                            <pre className="font-mono text-xs break-words whitespace-pre-wrap text-green-400">
                                {logs}
                                <div ref={logEndRef} />
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SystemHealthIndex.layout = {
    breadcrumbs: breadcrumbs,
};
