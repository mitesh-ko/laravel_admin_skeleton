import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Copy, Save } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes/admin';
import admin from '@/routes/admin';
import type { UtmSource } from '@/types/models/utm-source';

interface Props {
    utmSource?: UtmSource;
}

export default function CreateEdit({ utmSource }: Props) {
    const isEdit = !!utmSource;

    const { data, setData, post, put, processing, errors } = useForm({
        name: utmSource?.name || '',
        code: utmSource?.code || '',
        utm_medium: utmSource?.utm_medium || '',
        utm_campaign: utmSource?.utm_campaign || '',
        utm_content: utmSource?.utm_content || '',
        utm_term: utmSource?.utm_term || '',
        description: utmSource?.description || '',
        is_active: utmSource?.is_active ?? true,
    });

    let generatedUrl = '';

    if (typeof window !== 'undefined') {
        try {
            const url = new URL(window.location.origin);

            if (data.code) {
                url.searchParams.set('utm_source', data.code);
            }

            if (data.utm_medium) {
                url.searchParams.set('utm_medium', data.utm_medium);
            }

            if (data.utm_campaign) {
                url.searchParams.set('utm_campaign', data.utm_campaign);
            }

            if (data.utm_content) {
                url.searchParams.set('utm_content', data.utm_content);
            }

            if (data.utm_term) {
                url.searchParams.set('utm_term', data.utm_term);
            }

            generatedUrl = url.toString();
        } catch {
            // Invalid URL, wait for user to correct it
            generatedUrl = 'Invalid Website URL';
        }
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // If name is empty, auto-generate from campaign
        if (!data.name && data.utm_campaign) {
            setData('name', data.utm_campaign);
        }

        if (isEdit) {
            put(admin.utmSources.update.url(utmSource.id));
        } else {
            post(admin.utmSources.store.url());
        }
    };

    const copyToClipboard = () => {
        if (generatedUrl && generatedUrl !== 'Invalid Website URL') {
            navigator.clipboard.writeText(generatedUrl);
            toast('Copied! The URL has been copied to your clipboard.');
        }
    };

    return (
        <>
            <Head
                title={
                    isEdit
                        ? `Edit Campaign: ${utmSource?.name}`
                        : 'Create Campaign'
                }
            />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEdit ? 'Edit Campaign URL' : 'Create Campaign URL'}
                    </h2>
                    <Button variant="outline" asChild>
                        <Link href={admin.utmSources.index.url()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid max-w-4xl gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign URL Builder</CardTitle>
                            <CardDescription>
                                Fill all the required fields (marked with *) and
                                other campaign information. A final URL with UTM
                                codes will be automatically created.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {/* New UI mimicking the screenshot */}

                            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                                <div>
                                    <Label
                                        htmlFor="code"
                                        className="text-base font-semibold"
                                    >
                                        UTM Source{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        (utm_source)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        placeholder="e.g. google, newsletter, twitter"
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                                <div>
                                    <Label
                                        htmlFor="utm_medium"
                                        className="text-base font-semibold"
                                    >
                                        UTM Medium{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        (utm_medium)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="utm_medium"
                                        value={data.utm_medium}
                                        onChange={(e) =>
                                            setData(
                                                'utm_medium',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. cpc, banner, email"
                                    />
                                    {errors.utm_medium && (
                                        <p className="text-sm text-destructive">
                                            {errors.utm_medium}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                                <div>
                                    <Label
                                        htmlFor="utm_campaign"
                                        className="text-base font-semibold"
                                    >
                                        UTM Campaign{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        (utm_campaign)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="utm_campaign"
                                        value={data.utm_campaign}
                                        onChange={(e) =>
                                            setData(
                                                'utm_campaign',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. spring_sale, product_launch"
                                    />
                                    {errors.utm_campaign && (
                                        <p className="text-sm text-destructive">
                                            {errors.utm_campaign}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                                <div>
                                    <Label
                                        htmlFor="utm_content"
                                        className="text-base font-semibold"
                                    >
                                        UTM Content
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        (utm_content)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="utm_content"
                                        value={data.utm_content}
                                        onChange={(e) =>
                                            setData(
                                                'utm_content',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Any call-to-action or headline, e.g. buy-now"
                                    />
                                    {errors.utm_content && (
                                        <p className="text-sm text-destructive">
                                            {errors.utm_content}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                                <div>
                                    <Label
                                        htmlFor="utm_term"
                                        className="text-base font-semibold"
                                    >
                                        UTM Term
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        (utm_term)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="utm_term"
                                        value={data.utm_term}
                                        onChange={(e) =>
                                            setData('utm_term', e.target.value)
                                        }
                                        placeholder="Keywords for your paid search campaigns"
                                    />
                                    {errors.utm_term && (
                                        <p className="text-sm text-destructive">
                                            {errors.utm_term}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="text-base font-semibold"
                                    >
                                        Internal Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Facebook Ads (auto-generated if empty)"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                                <div>
                                    <Label
                                        htmlFor="description"
                                        className="text-base font-semibold"
                                    >
                                        Internal Description
                                    </Label>
                                </div>
                                <div className="space-y-2">
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Add any notes about this campaign source..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                                <div />
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                'is_active',
                                                checked as boolean,
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="is_active"
                                        className="cursor-pointer font-normal"
                                    >
                                        Active (Can still receive traffic)
                                    </Label>
                                    {errors.is_active && (
                                        <p className="mt-1 block w-full text-sm text-destructive">
                                            {errors.is_active}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Generated URL Card */}
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle>Generated Campaign URL</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Input
                                    readOnly
                                    value={generatedUrl}
                                    className="flex-1 bg-background font-mono text-sm"
                                    placeholder="Fill in the required fields above to generate your URL"
                                />
                                <Button
                                    type="button"
                                    onClick={copyToClipboard}
                                    disabled={
                                        !generatedUrl ||
                                        generatedUrl === 'Invalid Website URL'
                                    }
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy URL
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={admin.utmSources.index.url()}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {isEdit ? 'Update Campaign' : 'Save Campaign'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'UTM Campaigns', href: admin.utmSources.index.url() },
        { title: 'Builder', href: '#' },
    ],
};
