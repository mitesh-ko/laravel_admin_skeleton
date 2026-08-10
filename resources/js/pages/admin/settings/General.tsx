import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes/admin';
import admin from '@/routes/admin';

interface SettingsProps {
    settings: {
        site_name: string;
        site_active: boolean;
        support_email: string;
    };
}

export default function General({ settings }: SettingsProps) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name,
        site_active: settings.site_active,
        support_email: settings.support_email,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(admin.settings.updateGeneral.url(), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="System Settings" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        System Settings
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={dashboard().url}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Global System Settings</CardTitle>
                        <CardDescription>
                            Manage application-wide configurations. These
                            settings affect the entire system and all users.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="site_name">Site Name</Label>
                                <Input
                                    id="site_name"
                                    value={data.site_name}
                                    onChange={(e) =>
                                        setData('site_name', e.target.value)
                                    }
                                    placeholder="My Awesome App"
                                />
                                <InputError message={errors.site_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="support_email">
                                    Support Email
                                </Label>
                                <Input
                                    id="support_email"
                                    type="email"
                                    value={data.support_email}
                                    onChange={(e) =>
                                        setData('support_email', e.target.value)
                                    }
                                    placeholder="support@throtik.com"
                                />
                                <InputError message={errors.support_email} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="site_active"
                                    checked={data.site_active}
                                    onCheckedChange={(checked) =>
                                        setData('site_active', checked === true)
                                    }
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="site_active">
                                        Site Active (Maintenance Mode)
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        If unchecked, the application will
                                        display a maintenance page to normal
                                        users.
                                    </p>
                                </div>
                            </div>
                            <InputError message={errors.site_active} />
                        </CardContent>
                        <CardFooter className="border-t pt-6">
                            <Button type="submit" disabled={processing}>
                                Save Settings
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}

General.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '#',
        },
        {
            title: 'System Settings',
            href: admin.settings.editGeneral.url(),
        },
    ],
};
