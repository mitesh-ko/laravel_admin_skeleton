import { Head, Link, useForm } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth/auth-simple-layout';
import admin from '@/routes/admin';

interface Props {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export default function ImpersonateIndex({ user }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        pin: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(admin.impersonate.store.url(user.id));
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Head title={`Impersonate ${user.name}`} />

            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-destructive/10 p-3">
                            <ShieldAlert className="h-6 w-6 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Login As User
                    </CardTitle>
                    <CardDescription>
                        You are about to log in as <strong>{user.name}</strong>{' '}
                        ({user.email}). Please enter their 4-character
                        impersonation PIN to proceed.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={submit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pin">Impersonation PIN</Label>
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={4}
                                    value={data.pin}
                                    onChange={(value) =>
                                        setData('pin', value.toUpperCase())
                                    }
                                    autoFocus
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot
                                            index={0}
                                            className="h-12 w-12 font-mono text-lg uppercase"
                                        />
                                        <InputOTPSlot
                                            index={1}
                                            className="h-12 w-12 font-mono text-lg uppercase"
                                        />
                                        <InputOTPSlot
                                            index={2}
                                            className="h-12 w-12 font-mono text-lg uppercase"
                                        />
                                        <InputOTPSlot
                                            index={3}
                                            className="h-12 w-12 font-mono text-lg uppercase"
                                        />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            {errors.pin && (
                                <p className="text-sm text-destructive">
                                    {errors.pin}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 border-t border-transparent pt-4">
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={processing || data.pin.length !== 4}
                        >
                            Login as {user.name}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            asChild
                            disabled={processing}
                        >
                            <Link href={admin.users.index.url()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to account
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

ImpersonateIndex.layout = (page: ReactNode) => <AuthLayout children={page} />;
