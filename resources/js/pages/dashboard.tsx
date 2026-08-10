import { Head } from '@inertiajs/react';
import { Users, UserPlus, Activity } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { dashboard } from '@/routes/admin';
import type {
    ActivityLog,
    LoginChartData,
    UtmTrafficData,
    UtmRegistrationData,
} from '@/types';

interface Props {
    totalUsers: number;
    newRegistrations: number;
    loginChartData: LoginChartData[];
    latestActivities: ActivityLog[];
    utmTrafficData: UtmTrafficData[];
    utmRegistrationData: UtmRegistrationData[];
}

export default function Dashboard({
    totalUsers,
    newRegistrations,
    loginChartData,
    latestActivities,
    utmTrafficData,
    utmRegistrationData,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalUsers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active accounts on the platform
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                New Registrations
                            </CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {newRegistrations}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Users registered this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Recent Activity
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {latestActivities.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Logged actions recently
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-7">
                    {/* Line Chart Section */}
                    <Card className="md:col-span-4">
                        <CardHeader>
                            <CardTitle>Login Activity</CardTitle>
                            <CardDescription>
                                Daily logins over the last 30 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={loginChartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            className="stroke-muted"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                `${value}`
                                            }
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow:
                                                    '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            }}
                                            itemStyle={{ color: '#000' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="logins"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6 }}
                                            className="stroke-primary"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Feed Section */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Latest Activity</CardTitle>
                            <CardDescription>
                                Recent actions by users
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {latestActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm leading-none font-medium">
                                                {activity.user_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.event}{' '}
                                                {activity.auditable_type}
                                            </p>
                                        </div>
                                        <div className="ml-auto text-xs font-medium text-muted-foreground">
                                            {activity.created_at}
                                        </div>
                                    </div>
                                ))}

                                {latestActivities.length === 0 && (
                                    <div className="pt-4 text-center text-sm text-muted-foreground">
                                        No recent activity
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Marketing & UTM Analytics Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Traffic by Campaign</CardTitle>
                            <CardDescription>
                                Top campaigns driving traffic
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {utmTrafficData.map((data, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm leading-none font-medium">
                                                {data.campaign}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Source: {data.source}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {data.count} clicks
                                        </div>
                                    </div>
                                ))}
                                {utmTrafficData.length === 0 && (
                                    <div className="pt-4 text-center text-sm text-muted-foreground">
                                        No traffic data recorded.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Registrations by Campaign</CardTitle>
                            <CardDescription>
                                Top campaigns driving user signups
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {utmRegistrationData.map((data, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm leading-none font-medium">
                                                {data.campaign}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Source: {data.source}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-green-600">
                                            {data.count} users
                                        </div>
                                    </div>
                                ))}
                                {utmRegistrationData.length === 0 && (
                                    <div className="pt-4 text-center text-sm text-muted-foreground">
                                        No registration data recorded.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ],
};
