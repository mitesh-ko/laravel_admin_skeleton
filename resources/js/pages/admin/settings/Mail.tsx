import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes/admin';
import admin from '@/routes/admin';

interface MailSettingsProps {
    settings: {
        mail_mailer: string;
        mail_host: string;
        mail_port: number;
        mail_username: string;
        mail_password: string;
        mail_encryption: string | null;
        mail_from_address: string;
        mail_from_name: string;
    };
}

export default function Mail({ settings }: MailSettingsProps) {
    const { data, setData, put, processing, errors } = useForm({
        mail_mailer: settings.mail_mailer || 'log',
        mail_host: settings.mail_host || '127.0.0.1',
        mail_port: settings.mail_port || 2525,
        mail_username: settings.mail_username || '',
        mail_password: settings.mail_password || '',
        mail_encryption: settings.mail_encryption || '',
        mail_from_address: settings.mail_from_address || 'hello@throtik.com',
        mail_from_name: settings.mail_from_name || 'Throtik',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(admin.settings.updateMail.url(), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Mail Settings" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Mail Settings
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
                        <CardTitle>Mail Server Configuration</CardTitle>
                        <CardDescription>
                            Configure the SMTP settings used by the application
                            to send emails.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="mail_mailer">
                                        Mail Driver
                                    </Label>
                                    <Select
                                        value={data.mail_mailer}
                                        onValueChange={(value) =>
                                            setData('mail_mailer', value)
                                        }
                                    >
                                        <SelectTrigger id="mail_mailer">
                                            <SelectValue placeholder="Select driver" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="smtp">
                                                SMTP
                                            </SelectItem>
                                            <SelectItem value="log">
                                                Log
                                            </SelectItem>
                                            <SelectItem value="array">
                                                Array
                                            </SelectItem>
                                            <SelectItem value="mailgun">
                                                Mailgun
                                            </SelectItem>
                                            <SelectItem value="postmark">
                                                Postmark
                                            </SelectItem>
                                            <SelectItem value="ses">
                                                Amazon SES
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.mail_mailer} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail_host">Mail Host</Label>
                                    <Input
                                        id="mail_host"
                                        value={data.mail_host}
                                        onChange={(e) =>
                                            setData('mail_host', e.target.value)
                                        }
                                        placeholder="smtp.mailtrap.io"
                                    />
                                    <InputError message={errors.mail_host} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail_port">Mail Port</Label>
                                    <Input
                                        id="mail_port"
                                        type="number"
                                        value={data.mail_port}
                                        onChange={(e) =>
                                            setData(
                                                'mail_port',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        placeholder="2525"
                                    />
                                    <InputError message={errors.mail_port} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail_encryption">
                                        Encryption
                                    </Label>
                                    <Select
                                        value={data.mail_encryption || 'none'}
                                        onValueChange={(value) =>
                                            setData(
                                                'mail_encryption',
                                                value === 'none' ? '' : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger id="mail_encryption">
                                            <SelectValue placeholder="Select encryption" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                None
                                            </SelectItem>
                                            <SelectItem value="tls">
                                                TLS
                                            </SelectItem>
                                            <SelectItem value="ssl">
                                                SSL
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.mail_encryption}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail_username">
                                        Username
                                    </Label>
                                    <Input
                                        id="mail_username"
                                        value={data.mail_username}
                                        onChange={(e) =>
                                            setData(
                                                'mail_username',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.mail_username}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail_password">
                                        Password
                                    </Label>
                                    <Input
                                        id="mail_password"
                                        type="password"
                                        value={data.mail_password}
                                        onChange={(e) =>
                                            setData(
                                                'mail_password',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.mail_password}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail_from_address">
                                        From Address
                                    </Label>
                                    <Input
                                        id="mail_from_address"
                                        type="email"
                                        value={data.mail_from_address}
                                        onChange={(e) =>
                                            setData(
                                                'mail_from_address',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="noreply@example.com"
                                    />
                                    <InputError
                                        message={errors.mail_from_address}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail_from_name">
                                        From Name
                                    </Label>
                                    <Input
                                        id="mail_from_name"
                                        value={data.mail_from_name}
                                        onChange={(e) =>
                                            setData(
                                                'mail_from_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Admin"
                                    />
                                    <InputError
                                        message={errors.mail_from_name}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end border-t pt-6">
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}
Mail.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '#',
        },
        {
            title: 'Mail Settings',
            href: admin.settings.editMail.url(),
        },
    ],
};
