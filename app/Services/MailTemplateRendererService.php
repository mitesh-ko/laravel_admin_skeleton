<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\MailTemplate;
use Illuminate\Support\HtmlString;

class MailTemplateRendererService
{
    /**
     * Renders a MailTemplate model by replacing its snippets with actual data.
     *
     * @param  MailTemplate|string  $template  Either a MailTemplate model or a template key.
     * @param  array<string, string>  $data  Associative array where keys are snippets (without braces) and values are replacements.
     */
    public function render(MailTemplate|string $template, array $data = []): HtmlString
    {
        if (is_string($template)) {
            $template = MailTemplate::where('key', $template)->firstOrFail();
        }

        $html = $template->html_content;

        foreach ($data as $key => $value) {
            $html = str_replace('{'.$key.'}', (string) $value, $html);
        }

        return new HtmlString($html);
    }

    /**
     * Renders the subject of a MailTemplate.
     */
    public function renderSubject(MailTemplate|string $template, array $data = []): string
    {
        if (is_string($template)) {
            $template = MailTemplate::where('key', $template)->firstOrFail();
        }

        $subject = $template->subject;

        foreach ($data as $key => $value) {
            $subject = str_replace('{'.$key.'}', (string) $value, $subject);
        }

        return $subject;
    }
}
