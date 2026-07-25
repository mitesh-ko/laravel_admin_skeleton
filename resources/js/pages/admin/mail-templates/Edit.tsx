import { Head, Link, useForm } from '@inertiajs/react';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    ArrowLeft,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Save,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import admin from '@/routes/admin';

import type { MailTemplate } from '@/types/models/mail-template';

interface Props {
    template: MailTemplate;
}

const MenuBar = ({ editor }: { editor: Editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-t-md border-b bg-muted/50 p-2">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-muted' : ''}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-muted' : ''}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'bg-muted' : ''}
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-6 w-px bg-border"></div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                    editor.chain().focus().setTextAlign('left').run()
                }
                className={
                    editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''
                }
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                }
                className={
                    editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''
                }
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                    editor.chain().focus().setTextAlign('right').run()
                }
                className={
                    editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''
                }
            >
                <AlignRight className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-6 w-px bg-border"></div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                    editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''
                }
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                    editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''
                }
            >
                <Heading2 className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default function Edit({ template }: Props) {
    const [previewKey, setPreviewKey] = useState(() => Date.now());
    const { data, setData, put, processing, errors } = useForm({
        subject: template.subject,
        html_content: template.html_content,
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: template.html_content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setData('html_content', html);
        },
    });

    const insertSnippet = (snippet: string) => {
        if (editor) {
            editor.chain().focus().insertContent(`{${snippet}}`).run();
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(admin.mailTemplates.update.url(template.id), {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewKey(Date.now());
                toast.success('Mail template updated successfully');
            },
            onError: () => {
                toast.error('Failed to update mail template');
            },
        });
    };

    return (
        <>
            <Head title={`Edit Template: ${template.key}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Edit Template: {template.key}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Design the email layout and insert dynamic
                            variables.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={admin.mailTemplates.index.url()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Column: Editor */}
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject Line</Label>
                            <Input
                                id="subject"
                                value={data.subject}
                                onChange={(e) =>
                                    setData('subject', e.target.value)
                                }
                            />
                            {errors.subject && (
                                <p className="text-sm text-destructive">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Available Variables (Click to insert)</Label>
                            <div className="flex flex-wrap gap-2 rounded-md border bg-muted/20 p-4">
                                {template.available_snippets?.map((snippet) => (
                                    <Badge
                                        key={snippet}
                                        variant="outline"
                                        className="cursor-pointer font-mono text-xs hover:bg-primary hover:text-primary-foreground"
                                        onClick={() => insertSnippet(snippet)}
                                    >
                                        {`{${snippet}}`}
                                    </Badge>
                                ))}
                                {!template.available_snippets?.length && (
                                    <span className="text-sm text-muted-foreground">
                                        No variables available for this
                                        template.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col overflow-hidden rounded-md border shadow-sm">
                            <MenuBar editor={editor} />
                            <div className="prose prose-sm dark:prose-invert min-h-[400px] max-w-none cursor-text bg-background p-4 focus:outline-none">
                                <EditorContent
                                    editor={editor}
                                    className="min-h-[400px] focus:outline-none"
                                />
                            </div>
                        </div>
                        {errors.html_content && (
                            <p className="text-sm text-destructive">
                                {errors.html_content}
                            </p>
                        )}
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="flex flex-col gap-4">
                        <Label>Live Preview</Label>
                        <div className="flex flex-1 flex-col overflow-hidden rounded-md border bg-muted/30 shadow-sm">
                            {/* Render Subject */}
                            <div className="border-b bg-background p-4">
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Subject
                                </span>
                                <h3 className="mt-1 text-base font-medium">
                                    {data.subject || 'No Subject'}
                                </h3>
                            </div>

                            {/* Render Full Email Body */}
                            <iframe
                                key={previewKey}
                                className="pointer-events-none min-h-[500px] w-full flex-1 border-0 select-none"
                                title="Email Preview"
                                src={`${admin.mailTemplates.preview.url(template.id)}?t=${previewKey}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '#',
        },
        {
            title: 'Email Template',
            href: admin.mailTemplates.index.url(),
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
