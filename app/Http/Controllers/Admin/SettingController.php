<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\Setting\UpdateMailSettingAction;
use App\Actions\Admin\Setting\UpdateSettingAction;
use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateGeneralSettingRequest;
use App\Http\Requests\Admin\UpdateMailSettingRequest;
use App\Settings\GeneralSettings;
use App\Settings\MailSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display the general settings form.
     */
    public function editGeneral(GeneralSettings $settings): Response
    {
        Gate::authorize(PermissionName::MANAGE_GENERAL_SETTINGS->value);

        return Inertia::render('admin/settings/General', [
            'settings' => $settings->toArray(),
        ]);
    }

    /**
     * Update the general settings.
     */
    public function updateGeneral(UpdateGeneralSettingRequest $request, GeneralSettings $settings, UpdateSettingAction $action): RedirectResponse
    {
        $action->execute($settings, $request->toDTO());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'System settings updated successfully.']);

        return redirect()->back();
    }

    /**
     * Display the mail settings form.
     */
    public function editMail(MailSettings $settings): Response
    {
        Gate::authorize(PermissionName::MANAGE_MAIL_SETTINGS->value);

        return Inertia::render('admin/settings/Mail', [
            'settings' => $settings->toArray(),
        ]);
    }

    /**
     * Update the mail settings.
     */
    public function updateMail(UpdateMailSettingRequest $request, MailSettings $settings, UpdateMailSettingAction $action): RedirectResponse
    {
        $action->execute($settings, $request->toDTO());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Mail settings updated successfully.']);

        return redirect()->back();
    }
}
