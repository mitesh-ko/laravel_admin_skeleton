import { Form, Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { FileInput } from '@/components/ui/file-input';
import { ImageCropper } from '@/components/ui/image-cropper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    edit,
    impersonationToken as impersonationTokenUrl,
} from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth & { user: { avatar_url?: string | null } };
};

export default function Profile({
    mustVerifyEmail,
    status,
    impersonationToken,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    impersonationToken?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    const { data, setData, patch, processing, errors, reset } = useForm<{
        name: string;
        email: string;
        avatar: File | null;
    }>({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null,
    });

    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(ProfileController.update.url(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setLocalPreviewUrl(null);
                reset('avatar');
            },
        });
    };

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and email address"
                />

                <form onSubmit={submit} className="space-y-6">
                    <ImageCropper
                        isOpen={isCropperOpen}
                        onClose={() => setIsCropperOpen(false)}
                        imageSrc={rawImageSrc}
                        onCropComplete={(croppedFile) => {
                            setData('avatar', croppedFile);
                            setLocalPreviewUrl(
                                URL.createObjectURL(croppedFile),
                            );
                            setIsCropperOpen(false);
                        }}
                    />

                    <div className="flex items-start gap-6">
                        {(localPreviewUrl || auth.user?.avatar_url) && (
                            <div className="shrink-0">
                                <Label className="mb-2 block">
                                    Current Avatar
                                </Label>
                                <img
                                    src={
                                        localPreviewUrl ?? auth.user.avatar_url!
                                    }
                                    alt="Current Avatar"
                                    className="h-24 w-24 rounded-full border object-cover"
                                />
                            </div>
                        )}

                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="avatar">Upload New Avatar</Label>
                            <FileInput
                                id="avatar"
                                accept="image/*"
                                value={data.avatar}
                                onFileChange={(file) => {
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.addEventListener('load', () => {
                                            setRawImageSrc(
                                                reader.result as string,
                                            );
                                            setIsCropperOpen(true);
                                        });
                                        reader.readAsDataURL(file);
                                    } else {
                                        setData('avatar', null);
                                        setLocalPreviewUrl(null);
                                    }
                                }}
                            />
                            <InputError
                                className="mt-2"
                                message={errors.avatar as string}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Full name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="Email address"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    {mustVerifyEmail &&
                        auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={send()}
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to re-send the verification
                                        email.
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to
                                        your email address.
                                    </div>
                                )}
                            </div>
                        )}

                    <div className="flex items-center gap-4">
                        <Button
                            disabled={processing}
                            data-test="update-profile-button"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>

            <div className="mt-10 space-y-6 border-t pt-10">
                <Heading
                    variant="small"
                    title="Impersonation Code"
                    description="Your secure 4-character code used by admins to log into your account."
                />

                <div className="flex items-center gap-4">
                    <div className="rounded-md bg-muted px-4 py-2 font-mono text-lg font-bold tracking-widest uppercase">
                        {impersonationToken || 'NONE'}
                    </div>
                    <Form
                        {...impersonationTokenUrl.form()}
                        options={{ preserveScroll: true }}
                    >
                        {({ processing }) => (
                            <Button variant="outline" disabled={processing}>
                                Regenerate Code
                            </Button>
                        )}
                    </Form>
                </div>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
