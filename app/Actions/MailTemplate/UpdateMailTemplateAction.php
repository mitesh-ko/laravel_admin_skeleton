<?php

declare(strict_types=1);

namespace App\Actions\MailTemplate;

use App\Models\MailTemplate;
use Illuminate\Support\Facades\Log;

class UpdateMailTemplateAction
{
    public function execute(MailTemplate $template, array $data): MailTemplate
    {
        try {
            $template->update([
                'subject' => $data['subject'],
                'html_content' => $data['html_content'],
            ]);

            return $template;
        } catch (\Exception $e) {
            Log::error('Failed to update mail template.', [
                'error' => $e->getMessage(),
                'template_id' => $template->id,
            ]);

            throw $e;
        }
    }
}
