<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\DTOs\GeneralSettingDTO;
use App\Enums\PermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateGeneralSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::check(PermissionName::MANAGE_GENERAL_SETTINGS->value);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'site_name' => 'required|string|max:255',
            'site_active' => 'required|boolean',
            'support_email' => 'required|email|max:255',
        ];
    }

    public function toDTO(): GeneralSettingDTO
    {
        return new GeneralSettingDTO(
            site_name: $this->validated('site_name'),
            site_active: (bool) $this->validated('site_active'),
            support_email: $this->validated('support_email'),
        );
    }
}
