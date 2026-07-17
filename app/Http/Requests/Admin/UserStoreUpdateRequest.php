<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\DTOs\UserDTO;
use App\Enums\PermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserStoreUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->isMethod('post')) {
            return $this->user()->can(PermissionName::CREATE_USERS->value);
        }

        if (! $this->user()->can(PermissionName::EDIT_USERS->value)) {
            return false;
        }

        if ($this->user()->can(PermissionName::MANAGE_ALL_USERS->value)) {
            return true;
        }

        if ($this->user()->can(PermissionName::MANAGE_OWN_USERS->value)) {
            $userToEdit = $this->route('user');

            return $userToEdit && $userToEdit->created_by === $this->user()->id;
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->route('user')),
            ],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['string', 'exists:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
            'assigned_users' => ['nullable', 'array'],
            'assigned_users.*' => ['string', 'exists:users,id'],
        ];
    }

    public function toDTO(): UserDTO
    {
        return UserDTO::fromArray($this->validated());
    }
}
