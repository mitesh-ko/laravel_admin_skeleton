<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\MailTemplate\UpdateMailTemplateAction;
use App\DTOs\GlobalSearchDTO;
use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use App\Models\MailTemplate;
use App\Services\MailTemplateRendererService;
use App\Utils\TableUtility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\HtmlString;
use Inertia\Inertia;
use Inertia\Response;

class MailTemplateController extends Controller
{
    public function index(): Response
    {
        Gate::authorize(PermissionName::MANAGE_MAIL_TEMPLATES->value);

        return Inertia::render('admin/mail-templates/List');
    }

    public function search(Request $request): JsonResponse
    {
        Gate::authorize(PermissionName::MANAGE_MAIL_TEMPLATES->value);

        $query = MailTemplate::query();

        $globalSearchFields = [
            ['key' => 'key', 'op' => 'like', 'mask' => '%{value}%'],
            ['key' => 'subject', 'op' => 'like', 'mask' => '%{value}%'],
        ];

        return TableUtility::process($query, $request, [
            'globalSearch' => new GlobalSearchDTO($globalSearchFields),
            'filter',
            'sort',
            'paginate',
        ]);
    }

    public function edit(MailTemplate $mail_template): Response
    {
        Gate::authorize(PermissionName::MANAGE_MAIL_TEMPLATES->value);

        return Inertia::render('admin/mail-templates/Edit', [
            'template' => $mail_template,
        ]);
    }

    public function preview(MailTemplate $mail_template, MailTemplateRendererService $renderer)
    {
        Gate::authorize(PermissionName::MANAGE_MAIL_TEMPLATES->value);

        // Generate dummy data using logged in user
        $user = auth()->user();
        $dummyData = [
            'ACCOUNT_NAME' => $user ? ($user->name ?? $user->email) : 'Admin User',
            'TIME' => now()->toDateTimeString(),
            'IP_ADDRESS' => '127.0.0.1',
            'BROWSER' => 'Chrome',
            'LOCATION' => 'New York, NY',
            'CODE' => '123456',
        ];

        $html = $renderer->render($mail_template->key, $dummyData);
        $subject = $renderer->renderSubject($mail_template->key, $dummyData);

        $htmlString = (string) (new MailMessage)
            ->subject($subject)
            ->markdown('emails.generic', ['html' => new HtmlString($html)])
            ->render();

        return response($htmlString)->header('Content-Type', 'text/html');
    }

    public function update(
        Request $request,
        MailTemplate $mail_template,
        UpdateMailTemplateAction $action
    ) {
        Gate::authorize(PermissionName::MANAGE_MAIL_TEMPLATES->value);

        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'html_content' => ['required', 'string'],
        ]);

        $action->execute($mail_template, $validated);

        return back()->with('success', 'Mail template updated successfully.');
    }
}
