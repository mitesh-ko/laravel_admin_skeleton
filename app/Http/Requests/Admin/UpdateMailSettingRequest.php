<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\DTOs\MailSettingDTO;
use App\Enums\PermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMailSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can(PermissionName::MANAGE_MAIL_SETTINGS->value);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'mail_mailer' => ['required', 'string', 'in:smtp,log,array,mailgun,postmark,ses'],
            'mail_host' => ['required', 'string'],
            'mail_port' => ['required', 'integer'],
            'mail_username' => ['nullable', 'string'],
            'mail_password' => ['nullable', 'string'],
            'mail_encryption' => ['nullable', 'string', 'in:tls,ssl'],
            'mail_from_address' => ['required', 'email'],
            'mail_from_name' => ['required', 'string', 'max:255'],
        ];
    }

    public function toDTO(): MailSettingDTO
    {
        return new MailSettingDTO(
            mail_mailer: $this->validated('mail_mailer'),
            mail_host: $this->validated('mail_host'),
            mail_port: (int) $this->validated('mail_port'),
            mail_username: $this->validated('mail_username'),
            mail_password: $this->validated('mail_password'),
            mail_encryption: $this->validated('mail_encryption'),
            mail_from_address: $this->validated('mail_from_address'),
            mail_from_name: $this->validated('mail_from_name'),
        );
    }
}
