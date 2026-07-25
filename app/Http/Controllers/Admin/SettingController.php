<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\Setting\UpdateSettingAction;
use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateGeneralSettingRequest;
use App\Settings\GeneralSettings;
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
}
